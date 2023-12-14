const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants.js');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Double Firecracker",
	"Strike 6 random foes for @{damage} @{element} damage",
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
			targets.map(target => {
				target.addStagger("elementMatchFoe");
			})
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ target: `random${SAFE_DELIMITER}6`, team: "foe", needsLivingTargets: true })
	.setSidegrades("Mercurial Firecracker", "Toxic Firecracker")
	.setDurability(15)
	.setDamage(15);
