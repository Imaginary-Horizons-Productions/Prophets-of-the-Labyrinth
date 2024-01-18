const { GearTemplate } = require('../classes/index.js');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Abacus",
	"Deal @{damage} (+5% foe max hp) @{element} damage to a foe",
	"Damage x@{critMultiplier}",
	"Trinket",
	"Water",
	200,
	([target], user, isCrit, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage + (0.05 * target.getMaxHP());
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Hunter's Abacus", "Sharpened Abacus", "Toxic Abacus")
	.setDurability(15)
	.setDamage(40);
