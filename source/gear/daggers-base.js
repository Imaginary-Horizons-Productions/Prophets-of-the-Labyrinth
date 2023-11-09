const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Daggers",
	"Strike a foe for @{damage} @{element} damage",
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
	.setUpgrades("Sharpened Daggers", "Sweeping Daggers", "Slowing Daggers")
	.setDurability(15)
	.setDamage(75)
	.setCritBonus(3);
