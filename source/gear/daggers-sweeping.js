const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sweeping Daggers",
	"Strike all foes for @{damage} @{element} damage",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = damage;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		if (user.element === element) {
			targets.map(target => {
				target.addStagger("elementMatchFoe");
			})
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ target: "all", team: "foe", needsLivingTargets: true })
	.setSidegrades("Sharpened Daggers", "Slowing Daggers")
	.setDurability(15)
	.setCritMultiplier(3)
	.setDamage(50);
