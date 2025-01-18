const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addModifier, combineModifierReceipts, generateModifierResultLines } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Tornado Formation",
	[
		["use", "Deal <@{damage}> @{essence} damage to a single foe and grant all allies <@{mod0Stacks}> @{mod0}"],
		["Critical💥", "@{mod0} x @{critBonus}"]
	],
	"Maneuver",
	"Wind"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, moraleRequirement, scalings: { damage, critBonus }, modifiers: [swiftness] } = module.exports;
		if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough morale to pull it off."];
		}

		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
		const pendingSwiftness = { name: swiftness.name, stacks: swiftness.stacks.calculate(user) };
		const userTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
		if (user.crit) {
			pendingSwiftness.stacks *= critBonus;
		}
		resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(userTeam, pendingSwiftness))));
		return resultLines;
	}, { type: "single", team: "foe" })
	.setUpgrades("Charging Storm Formation", "Supportive Storm Formation")
	.setMoraleRequirement(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers({ name: "Swiftness", stacks: { description: "2 + 10% Bonus Speed", calculate: (user) => 2 + Math.floor(user.getBonusSpeed() / 10) } });
