const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Piercing Warhammer",
	"Strike a foe for @{damage} (+@{bonus} if foe is currently stunned) unblockable @{element} damage",
	"Damage x@{critBonus}",
	"Weapon",
	"Earth",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, damage, bonus, critBonus } = module.exports;
		if (target.isStunned) {
			damage += bonus;
		}
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critBonus;
		}
		return dealDamage([target], user, damage, true, element, adventure);
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Reactive Warhammer", "Slowing Warhammer")
	.setDurability(15)
	.setDamage(75)
	.setBonus(75); // damage
