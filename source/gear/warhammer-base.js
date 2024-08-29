const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Warhammer",
	"Strike a foe for @{damage} (+@{bonus} if foe is stunned) @{element} damage",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	200,
	([target], user, isCrit, adventure) => {
		const { element, damage, bonus, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (target.isStunned) {
			pendingDamage += bonus;
		}
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Reactive Warhammer", "Slowing Warhammer", "Unstoppable Warhammer")
	.setDurability(15)
	.setDamage(40)
	.setBonus(75); // damage
