const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Staggering Strong Attack",
	"Strike a foe applying @{foeStagger} and @{damage} @{element} damage",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Untyped",
	350,
	([target], user, isCrit, adventure) => {
		const { damage, element, stagger, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		target.addStagger(stagger);
		return dealDamage([target], user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Sharpened Weapon")
	.setDurability(15)
	.setDamage(65)
	.setStagger(2);
