const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Bow",
	"Strike a foe for @{damage} @{element} damage with priority",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Wind",
	200,
	([target], user, isCrit, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Evasive Bow", "Hunter's Bow", "Mercurial Bow")
	.setDurability(15)
	.setDamage(40)
	.setPriority(1);
