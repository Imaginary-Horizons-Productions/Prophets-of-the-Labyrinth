const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Daggers",
	"Strike a foe for @{damage} @{element} damage",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Wind",
	200,
	([target], user, isCrit, adventure) => {
		let { element, damage, critMultiplier } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critMultiplier;
		}
		return dealDamage([target], user, damage, false, element, adventure);
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Sharpened Daggers", "Sweeping Daggers", "Slowing Daggers")
	.setDurability(15)
	.setDamage(75)
	.setCritMultiplier(3);
