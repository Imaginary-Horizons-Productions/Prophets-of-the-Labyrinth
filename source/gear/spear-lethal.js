const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Lethal Spear",
	"Strike a foe for @{damage} @{element} damage",
	"Damage x@{critMultiplier}, also inflict @{foeStagger}",
	"Weapon",
	"Wind",
	350,
	([target], user, isCrit, adventure) => {
		const { element, stagger, damage, critMultiplier } = module.exports;
		let pendingDamage = damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
			target.addStagger(stagger);
		}
		return `${dealDamage([target], user, pendingDamage, false, element, adventure)}${isCrit ? ` ${target.getName(adventure.room.enemyIdMap)} is Staggered.` : ""}`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Reactive Spear", "Sweeping Spear")
	.setStagger(2)
	.setDurability(15)
	.setDamage(65);
