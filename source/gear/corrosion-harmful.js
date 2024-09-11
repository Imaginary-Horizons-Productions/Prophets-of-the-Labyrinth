const { GearTemplate } = require("../classes");
const { addModifier, dealDamage, changeStagger, getNames } = require("../util/combatantUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new GearTemplate("Harmful Corrosion",
	[
		["use", "Inflict @{damage} @{element} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Inflict @{bonus} more Stagger"]
	],
	"Spell",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerDown], bonus, damage } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			changeStagger(targets, bonus);
		}
		const poweredDownTargets = addModifier(targets, powerDown);
		if (poweredDownTargets.length > 0) {
			return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${joinAsStatement(false, getNames(targets, adventure), "is", "are", "Powered Down")}${isCrit ? " and Staggered" : ""}.`;
		} else {
			return `${dealDamage(targets, user, pendingDamage, false, element, adventure)}${isCrit ? ` ${joinAsStatement(false, getNames(targets, adventure), "was", "were", "Staggered.")}` : ""}`;
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Fate-Sealing Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 })
	.setBonus(2) // Crit Stagger
	.setDamage(50)
	.setDurability(15);
