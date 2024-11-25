const { GearTemplate } = require("../classes");
const { ELEMENT_MATCH_STAGGER_FOE } = require("../constants");
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new GearTemplate("Shattering Corrosion",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} on a foe"],
		["Critical💥", "Inflict @{bonus} more Stagger"]
	],
	"Spell",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [powerDown, frail], bonus } = module.exports;
		let pendingStagger = 0;
		if (user.element === element) {
			pendingStagger += ELEMENT_MATCH_STAGGER_FOE;
		}
		const resultLines = [];
		if (user.crit) {
			pendingStagger += bonus;
			resultLines.push(joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered."));
		}
		if (pendingStagger > 0) {
			changeStagger(targets, user, pendingStagger);
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, powerDown).concat(addModifier(targets, frail)))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Fate-Sealing Corrosion", "Harmful Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 }, { name: "Frail", stacks: 4 })
	.setBonus(2) // Crit Stagger
	.setDurability(15);
