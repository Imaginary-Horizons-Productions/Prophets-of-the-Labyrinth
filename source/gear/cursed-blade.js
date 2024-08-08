const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Cursed Blade",
	"Strike a foe for @{damage} @{element} damage. Passive: Reduced your Max HP by @{maxHP}.",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Untyped",
	-50,
	(targets, user, isCrit, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Daggers", "Scythe", "Shortsword", "Spear")
	.setDurability(15)
	.setDamage(10)
	.setMaxHP(-50);
