const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addModifier, combineModifierReceipts, generateModifierResultLines } = require('../util/combatantUtil');
const { scalingSwiftness } = require('./shared/modifiers');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Charging Tornado Formation",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and grant all allies <@{mod0Stacks}> @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod0} x @{critBonus}"]
	],
	"Maneuver",
	"Wind"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, moraleRequirement, scalings: { damage, critBonus }, modifiers: [swiftness, empowerment] } = module.exports;
		if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough morale to pull it off."];
		}

		const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const receipts = [];
		const pendingSwiftness = { name: swiftness.name, stacks: swiftness.stacks.calculate(user) };
		const userTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
		if (user.crit) {
			pendingSwiftness.stacks *= critBonus;
		}
		receipts.push(...addModifier(userTeam, pendingSwiftness).concat(addModifier(userTeam, empowerment)));
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}, { type: "single", team: "foe" })
	.setSidegrades("Supportive Storm Formation")
	.setMoraleRequirement(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers(scalingSwiftness(2), { name: "Empowerment", stacks: 25 });
