const { GearTemplate, GearFamily } = require('../classes/index.js');
const { removeModifier, combineModifierReceipts, generateModifierResultLines } = require('../util/combatantUtil.js');

//#region Base
const base = new GearTemplate("Appease",
	[["use", "Shrug off all insults"]],
	"Action",
	"Unaligned"
).setEffect(execute, { type: "self", team: "ally" });

function execute(targets, user, adventure) {
	const receipts = [];
	for (const insult of ["Boring", "Lacking Rhythm", "Smelly", "Stupid", "Ugly"]) {
		receipts.push(...removeModifier([user], { name: insult, stacks: "all" }));
	}
	return generateModifierResultLines(combineModifierReceipts(receipts));
}
//#endRegion Base

module.exports = new GearFamily(base, [], true);
