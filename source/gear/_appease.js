const { GearTemplate } = require('../classes/index.js');
const { removeModifier, combineModifierReceipts, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Appease",
	[["use", "Shrug off all insults"]],
	"Action",
	"Unaligned"
).setEffect((targets, user, adventure) => {
	const receipts = [];
	for (const insult of ["Boring", "Lacking Rhythm", "Smelly", "Stupid", "Ugly"]) {
		receipts.push(...removeModifier([user], { name: insult, stacks: "all" }));
	}
	return generateModifierResultLines(combineModifierReceipts(receipts));
}, { type: "self", team: "ally" });
