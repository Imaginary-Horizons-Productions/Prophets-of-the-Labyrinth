const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Morning Star",
	"Strike a foe applying @{stagger} and @{damage} @{element} damage",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Light",
	200,
	([target], user, isCrit, adventure) => {
		let { element, stagger, damage, critMultiplier } = module.exports;
		let pendingDamage = damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		target.addStagger(stagger);
		return `${dealDamage([target], user, pendingDamage, false, element, adventure)} ${target.getName(adventure.room.enemyIdMap)} is Staggered.`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setStagger(2)
	.setDurability(15)
	.setDamage(75);
