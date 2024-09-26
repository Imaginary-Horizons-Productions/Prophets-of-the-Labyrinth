const { GearTemplate } = require("../classes");
const { addModifier, changeStagger } = require("../util/combatantUtil");
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
		const resultLines = addModifier(targets, powerDown);
		if (isCrit) {
			changeStagger(targets, bonus);
			resultLines.push(joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered."));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Fate-Sealing Corrosion", "Harmful Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 })
	.setBonus(2) // Crit Stagger
	.setDurability(15);
