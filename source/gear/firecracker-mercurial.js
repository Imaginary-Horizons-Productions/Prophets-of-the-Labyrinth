const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Mercurial Firecracker",
	"Strike 3 random foes for @{damage} damage matching the user's element",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		return dealDamage(targets, user, pendingDamage, false, user.element, adventure);
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}3`, team: "foe", needsLivingTargets: true })
	.setSidegrades("Double Firecracker", "Toxic Firecracker")
	.setDurability(15)
	.setDamage(15);
