const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Lance",
	[
		["use", "Strike a foe for ([@{damage}] + [@{bonusSpeed}]) @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Earth",
	200,
	(targets, user, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + Math.max(0, user.getSpeed(true) - 100) + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure);
	}
).setUpgrades("Duelist's Lance", "Shattering Lance", "Surpassing Lance")
	.setTargetingTags({ type: "single", team: "foe" })
	.setDurability(15)
	.setDamage(40);
