const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Strong Attack",
	"Strike a foe for @{damage} @{element} damage",
	"Damage x@{critMultiplier}",
	"Technique",
	"Untyped",
	200,
	([target], user, isCrit, adventure) => {
		const { damage, element, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Sharpened Strong Attack", "Staggering Strong Attack")
	.setDurability(15)
	.setDamage(65);
