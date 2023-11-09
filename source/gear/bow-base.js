const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Bow",
	"Strike a foe for @{damage} @{element} damage with priority",
	"Damage x@{critBonus}",
	"Weapon",
	"Wind",
	200,
	([target], user, isCrit, adventure) => {
		let { element, damage, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critBonus;
		}
		return dealDamage([target], user, damage, false, element, adventure);
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Evasive Bow", "Hunter's Bow", "Mercurial Bow")
	.setDurability(15)
	.setDamage(75)
	.setPriority(1);
