const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addModifier, combineModifierReceipts, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Tornado Formation",
	[
		["use", "Deal @{damage} @{essence} damage to a single foe and grant all allies @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} x @{critMultiplier}"]
	],
	"Maneuver",
	"Wind",
	200,
	(targets, user, adventure) => {
		const { essence, moraleRequirement, damage, modifiers: [swiftness], critMultiplier } = module.exports;
		if (adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough Morale to pull it off."];
		}

		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = dealDamage(targets, user, damage + user.getPower(), false, essence, adventure);
		const pendingSwiftness = { ...swiftness };
		const userTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
		if (user.crit) {
			pendingSwiftness.stacks *= critMultiplier;
		}
		resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(userTeam, pendingSwiftness))));
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Charging Storm Formation", "Supportive Storm Formation")
	.setMoraleRequirement(1)
	.setDamage(40)
	.setModifiers({ name: "Swiftness", stacks: 2 });
