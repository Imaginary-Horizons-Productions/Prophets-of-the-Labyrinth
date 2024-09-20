const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, getNames } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new GearTemplate("Corrosion",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Inflict @{bonus} more Stagger"]
	],
	"Spell",
	"Fire",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerDown], bonus } = module.exports;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const poweredDownTargets = addModifier(targets, powerDown);
		const targetNames = getNames(targets, adventure);
		const resultLines = [];
		if (poweredDownTargets.length > 0) {
			resultLines.push(joinAsStatement(false, targetNames, "gains", "gain", `${getApplicationEmojiMarkdown("Power Down")}.`));
		}
		if (isCrit) {
			changeStagger(targets, bonus);
			resultLines.push(joinAsStatement(false, targetNames, "was", "were", "Staggered."));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Fate-Sealing Corrosion", "Harmful Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 })
	.setBonus(2) // Crit Stagger
	.setDurability(15);
