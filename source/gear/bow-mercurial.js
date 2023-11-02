const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Mercurial Bow",
	"Strike a foe for @{damage} damage matching the user's element with priority",
	"Damage x@{critBonus}",
	"Weapon",
	"Wind",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, damage, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critBonus;
		}
		return dealDamage([target], user, damage, false, element, adventure);
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Evasive Bow", "Hunter's Bow")
	.setDurability(15)
	.setDamage(75)
	.setPriority(1);
