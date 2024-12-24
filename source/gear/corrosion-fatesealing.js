const { GearTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_FOE } = require("../constants");
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new GearTemplate("Fate-Sealing Corrosion",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Inflict @{bonus} more Stagger and @{mod1Stacks} @{mod1}"]
	],
	"Spell",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [powerDown, retain], bonus } = module.exports;
		let pendingStagger = 0;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		const resultLines = [];
		const receipts = addModifier(targets, powerDown);
		if (user.crit) {
			pendingStagger += bonus;
			resultLines.push(joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered."));
			receipts.push(...addModifier(targets, retain));
		}
		if (pendingStagger > 0) {
			changeStagger(targets, user, pendingStagger);
		}
		return generateModifierResultLines(combineModifierReceipts(receipts)).concat(resultLines);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Fatiguing Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Disempowerment", stacks: 20 }, { name: "Retain", stacks: 1 })
	.setBonus(2) // Crit Stagger
	.setCharges(15);
