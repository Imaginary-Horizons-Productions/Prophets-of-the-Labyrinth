const { GearTemplate } = require('../classes/index.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Unstoppable Warhammer",
	"Strike a foe for @{damage} (+@{bonus} if foe is currently stunned) unblockable @{element} damage, even while Stunned",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	350,
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
		return dealDamage([target], user, pendingDamage, true, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Reactive Warhammer", "Slowing Warhammer")
	.setDurability(15)
	.setDamage(40)
	.setBonus(75); // damage
