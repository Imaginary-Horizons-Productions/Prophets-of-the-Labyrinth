const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Lethal Spear",
	"Strike a foe for @{damage} @{element} damage",
	"Damage x@{critBonus}, also inflict @{stagger}",
	"Weapon",
	"Wind",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, stagger, damage, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critBonus;
			target.addStagger(stagger);
		}
		return dealDamage([target], user, damage, false, element, adventure);
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Reactive Spear", "Sweeping Spear")
	.setStagger(2)
	.setDurability(15)
	.setDamage(100);
