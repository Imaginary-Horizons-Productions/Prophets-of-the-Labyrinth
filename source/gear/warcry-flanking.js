const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, concatTeamMembersWithModifier, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Flanking War Cry",
	[
		["use", "Stagger and inflict @{mod1Stacks} @{mod1} on a single foe and all foes with @{mod0}"],
		["Critical💥", "Stagger x @{critMultiplier}"]
	],
	"Support",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { essence, stagger, critMultiplier, modifiers: [targetModifier, exposure] } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.room.enemies : adventure.delvers, targetModifier.name);

		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		if (user.crit) {
			pendingStagger *= critMultiplier;
		}
		changeStagger(allTargets, user, pendingStagger);
		return [joinAsStatement(false, allTargets.map(allTargets.name), "was", "were", "Staggered.")].concat(generateModifierResultLines(combineModifierReceipts(addModifier(allTargets, exposure))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Weakening Warcry")
	.setCooldown(1)
	.setModifiers({ name: "Distraction", stacks: 0 }, { name: "Exposure", stacks: { description: "2 + Bonus Speed / 10", generator: (user) => 2 + Math.floor(user.getBonusSpeed() / 10) } })
	.setStagger(2);
