const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants.js');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Double Firecracker",
	"Strike 6 random foes for @{damage} @{element} damage",
	"Damage x@{critBonus}",
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, damage, critBonus } = module.exports;
		let pendingDamage = damage;
		if (isCrit) {
			pendingDamage *= critBonus;
		}
		targets.map(target => {
			if (user.element === element) {
				target.addStagger("elementMatchFoe");
			}
		})
		return dealDamage(targets, user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ target: `random${SAFE_DELIMITER}6`, team: "foe", needsLivingTargets: true })
	.setSidegrades("Mercurial Firecracker", "Toxic Firecracker")
	.setDurability(15)
	.setCritBonus(2)
	.setDamage(50);
