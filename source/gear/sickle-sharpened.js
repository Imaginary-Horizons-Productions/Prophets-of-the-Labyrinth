const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sharpened Sickle",
	"Strike a foe for @{damage} (+5% foe max hp) @{element} damage",
	"Damage x@{critBonus}",
	"Weapon",
	"Water",
	350,
	([target], user, isCrit, adventure) => {
		let { element, damage, critBonus } = module.exports;
		damage += (0.05 * target.maxHP);
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critBonus;
		}
		return dealDamage([target], user, damage, false, element, adventure);
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Hunter's Sickle", "Toxic Sickle")
	.setDurability(15)
	.setDamage(125);
