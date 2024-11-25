const { GearTemplate } = require("../classes");
const { ELEMENT_MATCH_STAGGER_FOE } = require("../constants");
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new GearTemplate("Corrosion",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Inflict @{bonus} more Stagger"]
	],
	"Spell",
	"Fire",
	200,
	(targets, user, adventure) => {
		const { element, modifiers: [powerDown], bonus } = module.exports;
		let pendingStagger = 0;
		if (user.element === element) {
			pendingStagger += ELEMENT_MATCH_STAGGER_FOE;
		}
		const resultLines = generateModifierResultLines(combineModifierReceipts(addModifier(targets, powerDown)));
		if (user.crit) {
			pendingStagger += bonus;
			resultLines.push(joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered."));
		}
		if (pendingStagger > 0) {
			changeStagger(targets, user, pendingStagger);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Fate-Sealing Corrosion", "Harmful Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 })
	.setBonus(2) // Crit Stagger
	.setDurability(15);
