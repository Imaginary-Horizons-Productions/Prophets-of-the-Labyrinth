const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, getNames } = require("../util/combatantUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new GearTemplate("Corrosion",
	"Inflict @{mod0Stacks} @{mod0} on a foe",
	"Inflict @{bonus} more Stagger",
	"Spell",
	"Fire",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerDown], bonus } = module.exports;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			changeStagger(targets, bonus);
		}
		const poweredDownTargets = addModifier(targets, powerDown);
		const targetNames = getNames(targets, adventure);
		if (poweredDownTargets.length > 0) {
			return `${joinAsStatement(false, targetNames, "is", "are", "Powered Down")}${isCrit ? " and Staggered" : ""}.`;
		} else if (isCrit) {
			return joinAsStatement(false, targetNames, "was", "were", "Staggered.");
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Fate-Sealing Corrosion", "Harmful Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 })
	.setBonus(2) // Crit Stagger
	.setDurability(15);
