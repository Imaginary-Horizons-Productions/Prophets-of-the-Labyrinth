const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Bashing Morning Star",
	"Strike a foe applying @{foeStagger} and @{damage} (+protection) @{element} damage",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		const { element, stagger, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage + user.protection;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		target.addStagger(stagger);
		return `${dealDamage([target], user, pendingDamage, false, element, adventure)} ${target.getName(adventure.room.enemyIdMap)} is Staggered.`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Awesome Morning Star")
	.setStagger(2)
	.setDurability(15)
	.setDamage(40);
