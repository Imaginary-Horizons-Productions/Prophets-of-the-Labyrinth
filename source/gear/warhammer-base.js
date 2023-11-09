const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Warhammer",
	"Strike a foe for @{damage} (+@{bonus} if foe is currently stunned) @{element} damage",
	"Damage x@{critBonus}",
	"Weapon",
	"Earth",
	200,
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
		return dealDamage([target], user, damage, false, element, adventure);
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Reactive Warhammer", "Slowing Warhammer", "Unstoppable Warhammer")
	.setDurability(15)
	.setDamage(75)
	.setBonus(75); // damage
