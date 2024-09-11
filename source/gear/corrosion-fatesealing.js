const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, getNames } = require("../util/combatantUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new GearTemplate("Fate-Sealing Corrosion",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Inflict @{bonus} more Stagger and @{mod1Stacks} @{mod1}"]
	],
	"Spell",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerDown, stasis], bonus } = module.exports;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const sentences = [];
		const poweredDownTargets = addModifier(targets, powerDown);
		if (poweredDownTargets.length > 0) {
			sentences.push(joinAsStatement(false, getNames(poweredDownTargets, adventure), "is", "are", "Powered Down."));
		}
		if (isCrit) {
			changeStagger(targets, bonus);
			sentences.push(joinAsStatement(false, getNames(targets, adventure), "was", "were", "Staggered."));
			const sealedTargets = addModifier(targets, stasis);
			if (sealedTargets.length > 0) {
				sentences.push(joinAsStatement(false, getNames(sealedTargets, adventure), "enters", "enter", "Stasis."));
			}
		}
		if (sentences.length > 0) {
			return sentences.join(" ");
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Harmful Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 }, { name: "Stasis", stacks: 1 })
	.setBonus(2) // Crit Stagger
	.setDurability(15);
