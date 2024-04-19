const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Awesome Morning Star",
	"Strike a foe applying @{foeStagger} and @{damage} (+@{bonus} if foe is currently stunned) @{element} damage",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		const { element, stagger, damage, critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (target.isStunned) {
			pendingDamage += bonus;
		}
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		changeStagger([target], stagger);
		return `${dealDamage([target], user, pendingDamage, false, element, adventure)} ${target.getName(adventure.room.enemyIdMap)} is Staggered.`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Bashing Morning Star")
	.setStagger(2)
	.setDurability(15)
	.setDamage(40)
	.setBonus(75);
