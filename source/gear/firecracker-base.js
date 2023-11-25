const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants.js');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Firecracker",
	"Strike 3 random foes for @{damage} @{element} damage",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Fire",
	200,
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
).setTargetingTags({ target: `random${SAFE_DELIMITER}3`, team: "foe", needsLivingTargets: true })
	.setUpgrades("Double Firecracker", "Mercurial Firecracker", "Toxic Firecracker")
	.setDurability(15)
	.setDamage(15);
