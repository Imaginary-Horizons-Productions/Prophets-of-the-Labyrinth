const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, getNames } = require("../util/combatantUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new GearTemplate("Shattering Corrosion",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} on a foe"],
		["Critical💥", "Inflict @{bonus} more Stagger"]
	],
	"Spell",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerDown, frail], bonus } = module.exports;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const targetNames = getNames(targets, adventure);
		const sentences = [];
		if (isCrit) {
			changeStagger(targets, bonus);
			sentences.push(joinAsStatement(false, targetNames, "was", "were", "Staggered."));
		}
		const poweredDownTargets = addModifier(targets, powerDown);
		if (poweredDownTargets.length > 0) {
			sentences.push(joinAsStatement(false, getNames(poweredDownTargets, adventure), "is", "are", "Powered Down."));
		}
		const frailedTargets = addModifier(targets, frail);
		if (frailedTargets.length > 0) {
			sentences.push(joinAsStatement(false, getNames(frailedTargets, adventure), "becomes", "become", "Frail."));
		}
		if (sentences.length > 0) {
			return sentences.join(" ");
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Fate-Sealing Corrosion", "Harmful Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 }, { name: "Frail", stacks: 4 })
	.setBonus(2) // Crit Stagger
	.setDurability(15);
