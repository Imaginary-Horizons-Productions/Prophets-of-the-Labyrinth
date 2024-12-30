const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addModifier, combineModifierReceipts, generateModifierResultLines } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Supportive Tornado Formation",
	[
		["use", "Deal @{damage} @{essence} damage to a single foe, then grant @{mod0Stacks} @{mod0} to and relieve @{bonus} Stagger for all allies"],
		["Critical💥", "@{mod0} x @{critMultiplier}"]
	],
	"Maneuver",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, moraleRequirement, damage, modifiers: [swiftness], critMultiplier, bonus } = module.exports;
		if (adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough Morale to pull it off."];
		}

		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = dealDamage(targets, user, damage + user.getPower(), false, essence, adventure);
		const pendingStagger = { ...swiftness };
		const userTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
		if (user.crit) {
			pendingStagger.stacks *= critMultiplier;
		}
		resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(userTeam, pendingStagger))));
		changeStagger(userTeam, user, bonus);
		return resultLines.concat(joinAsStatement(false, userTeam.map(combatant => combatant.name), "is", "are", "relieved of Stagger."));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Charging Storm Formation")
	.setMoraleRequirement(1)
	.setDamage(40)
	.setModifiers({ name: "Swiftness", stacks: 2 })
	.setBonus(2); // Stagger relieved
