const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Lethal Spear",
	"Strike a foe for @{damage} @{element} damage",
	"Damage x@{critMultiplier}, also inflict @{foeStagger}",
	"Weapon",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, stagger, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
			changeStagger(targets, stagger);
		}
		return `${dealDamage(targets, user, pendingDamage, false, element, adventure)}${isCrit ? ` ${joinAsStatement(false, getNames(targets), "was", "were", "Staggered.")}` : ""}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Reactive Spear", "Sweeping Spear")
	.setStagger(2)
	.setDurability(15)
	.setDamage(65);
