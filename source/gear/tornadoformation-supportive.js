const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addModifier, combineModifierReceipts, generateModifierResultLines } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');
const { scalingSwiftness } = require('./shared/modifiers');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Supportive Tornado Formation",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe, then grant <@{mod0Stacks}> @{mod0} to and relieve @{staggerRelief} Stagger for all allies"],
		["Critical💥", "@{mod0} x @{critBonus}"]
	],
	"Maneuver",
	"Wind"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, moraleRequirement, scalings: { damage, critBonus, staggerRelief }, modifiers: [swiftness] } = module.exports;
		if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough morale to pull it off."];
		}

		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
		const pendingStagger = { name: swiftness.name, stacks: swiftness.stacks.calculate(user) };
		const userTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
		if (user.crit) {
			pendingStagger.stacks *= critBonus;
		}
		resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(userTeam, pendingStagger))));
		changeStagger(userTeam, user, staggerRelief);
		return resultLines.concat(joinAsStatement(false, userTeam.map(combatant => combatant.name), "is", "are", "relieved of Stagger."));
	}, { type: "single", team: "foe" })
	.setSidegrades("Charging Storm Formation")
	.setMoraleRequirement(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		staggerRelief: 2
	})
	.setModifiers(scalingSwiftness(2));
