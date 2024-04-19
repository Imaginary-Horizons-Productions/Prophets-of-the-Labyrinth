const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, getNames } = require("../util/combatantUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new GearTemplate("Flanking Corrosion",
	"Inflict @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} on a foe",
	"Also inflict @{extraStagger}",
	"Spell",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerDown, exposed], stagger } = module.exports;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		let staggeredSentence;
		if (isCrit) {
			changeStagger(targets, stagger);
			staggeredSentence = joinAsStatement(false, getNames(getNames(targets, adventure), adventure), "was", "were", "Staggered.");
		}
		const poweredDownTargets = addModifier(targets, powerDown);
		const exposedTargets = addModifier(targets, exposed);
		if (exposedTargets) {
			const sentences = [
				joinAsStatement(false, getNames(poweredDownTargets, adventure), "is", "are", "Powered Down."),
				joinAsStatement(false, getNames(exposedTargets, adventure), "is", "are", "Exposed."),
			];
			if (isCrit) {
				sentences.push(staggeredSentence);
			}
			return sentences.join(" ");
		} else if (isCrit) {
			return staggeredSentence;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Harmful Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 }, { name: "Exposed", stacks: 2 })
	.setStagger(2)
	.setDurability(15);
