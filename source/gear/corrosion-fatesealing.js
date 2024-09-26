const { GearTemplate } = require("../classes");
const { addModifier, changeStagger } = require("../util/combatantUtil");
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
		const resultLines = [];
		const poweredDownTargets = addModifier(targets, powerDown);
		if (poweredDownTargets.length > 0) {
			resultLines.push(joinAsStatement(false, poweredDownTargets.map(target => target.name), "is", "are", "Powered Down."));
		}
		if (isCrit) {
			changeStagger(targets, bonus);
			resultLines.push(joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered."));
			const sealedTargets = addModifier(targets, stasis);
			if (sealedTargets.length > 0) {
				resultLines.push(joinAsStatement(false, sealedTargets.map(target => target.name), "enters", "enter", "Stasis."));
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Harmful Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 }, { name: "Stasis", stacks: 1 })
	.setBonus(2) // Crit Stagger
	.setDurability(15);
