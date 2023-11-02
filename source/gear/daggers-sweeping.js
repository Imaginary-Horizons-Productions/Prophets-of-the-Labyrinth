const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sweeping Daggers",
	"Strike all foes for @{damage} @{element} damage",
	"Damage x@{critBonus}",
	"Weapon",
	"Wind",
	350,
	needsLivingTargets((targets, user, isCrit, adventure) => {
		let { element, damage, critBonus } = module.exports;
		targets.map(target => {
			if (user.element === element) {
				target.addStagger("elementMatchFoe");
			}
			if (isCrit) {
				damage *= critBonus;
			}
		})
		return dealDamage(targets, user, damage, false, element, adventure);
	})
).setTargetingTags({ target: "all", team: "enemy" })
	.setSidegrades("Sharpened Daggers", "Slowing Daggers")
	.setDurability(15)
	.setCritBonus(3)
	.setDamage(50);
