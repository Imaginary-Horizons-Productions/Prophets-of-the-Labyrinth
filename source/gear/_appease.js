const { GearTemplate } = require('../classes/index.js');
const { removeModifier, combineModifierReceipts, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Appease",
	[["use", "Shrug off all insults"]],
	"Action",
	"Untyped",
	0,
	(targets, user, adventure) => {
		const receipts = [];
		for (const insult of ["Boring", "Lacking Rhythm", "Smelly", "Stupid", "Ugly"]) {
			receipts.push(...removeModifier([user], { name: insult, stacks: "all", force: true }));
		}
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setTargetingTags({ type: "self", team: "ally" });
