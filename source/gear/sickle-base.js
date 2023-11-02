const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sickle",
	"Strike a foe for @{damage} (+5% foe max hp) @{element} damage",
	"Damage x@{critBonus}",
	"Weapon",
	"Water",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, damage, critBonus } = module.exports;
		damage += (0.05 * target.maxHP);
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critBonus;
		}
		return dealDamage([target], user, damage, false, element, adventure);
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Hunter's Sickle", "Sharpened Sickle", "Toxic Sickle")
	.setDurability(15)
	.setDamage(75);
