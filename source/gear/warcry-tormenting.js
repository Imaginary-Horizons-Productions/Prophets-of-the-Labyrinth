const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts, concatTeamMembersWithModifier } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');
const { getModifierCategory } = require('../modifiers/_modifierDictionary.js');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');

module.exports = new GearTemplate("Tormenting War Cry",
	[
		["use", "Duplicate debuffs on a foe and Stagger them; also target all foes with @{mod0}"],
		["Critical💥", "Stagger +@{bonus}"]
	],
	"Technique",
	"Light",
	350,
	(targets, user, adventure) => {
		const { essence, stagger, bonus, modifiers: [targetModifier] } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.room.enemies : adventure.delvers, targetModifier.name);

		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		if (user.crit) {
			pendingStagger += bonus;
		}
		const resultLines = [joinAsStatement(false, allTargets.map(target => target.name), "was", "were", "Staggered.")];
		changeStagger(allTargets, user, pendingStagger);
		const receipts = [];
		for (const target of allTargets) {
			for (const modifier in target.modifiers) {
				if (getModifierCategory(modifier) === "Debuff") {
					receipts.push(...addModifier([target], { name: modifier, stacks: 1 }));
				}
			}
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Charging War Cry", "Slowing War Cry")
	.setModifiers({ name: "Distracted", stacks: 0 })
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setCooldown(1);
