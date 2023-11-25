const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Slowing Warhammer",
	"Strike a foe for @{damage} (+@{bonus} if foe is currently stunned) @{element} damage and inflict @{mod0Stacks} @{mod0}",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [slow], damage, bonus, critMultiplier } = module.exports;
		let pendingDamage = damage;
		if (target.isStunned) {
			pendingDamage += bonus;
		}
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		let resultText = dealDamage([target], user, pendingDamage, false, element, adventure)
		const addedSlow = addModifier(target, slow);
		if (addedSlow) {
			resultText += ` ${target.getName(adventure.room.enemyIdMap)} is Slowed.`;
		}
		return resultText;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Reactive Warhammer", "Unstoppable Warhammer")
	.setModifiers({ name: "Slow", stacks: 1 })
	.setDurability(15)
	.setDamage(40)
	.setBonus(75); // damage
