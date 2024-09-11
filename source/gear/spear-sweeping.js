const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Sweeping Spear",
	[
		["use", "Strike all foes for @{damage} @{element} damage"],
		["Critical💥", "Also inflict @{foeStagger}"]
	],
	"Weapon",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, stagger, damage } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			changeStagger(targets, stagger);
		}
		return `${dealDamage(targets, user, pendingDamage, false, element, adventure)}${isCrit ? ` ${joinAsStatement(false, getNames(targets), "was", "were", "Staggered.")}` : ""}`;
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Spear", "Reactive Spear")
	.setStagger(2)
	.setDurability(15)
	.setDamage(40);
