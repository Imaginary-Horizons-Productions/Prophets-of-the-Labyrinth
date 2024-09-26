const { GearTemplate } = require("../classes");
const { addModifier, changeStagger } = require("../util/combatantUtil");
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
		const resultLines = [];
		if (isCrit) {
			changeStagger(targets, bonus);
			resultLines.push(joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered."));
		}
		const poweredDownTargets = addModifier(targets, powerDown);
		if (poweredDownTargets.length > 0) {
			resultLines.push(joinAsStatement(false, poweredDownTargets.map(target => target.name), "is", "are", "Powered Down."));
		}
		const frailedTargets = addModifier(targets, frail);
		if (frailedTargets.length > 0) {
			resultLines.push(joinAsStatement(false, frailedTargets.map(target => target.name), "becomes", "become", "Frail."));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Fate-Sealing Corrosion", "Harmful Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 }, { name: "Frail", stacks: 4 })
	.setBonus(2) // Crit Stagger
	.setDurability(15);
