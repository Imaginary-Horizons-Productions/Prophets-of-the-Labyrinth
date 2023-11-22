const { GearTemplate } = require('../classes');
const { addModifier, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Ice Bolt",
	"Inflict @{damage} @{element} damage and @{mod0Stacks} @{mod0} on one foe",
	"Damage x@{critMultiplier}",
	"Spell",
	"Water",
	200,
	([target], user, isCrit, adventure) => {
		const { element, damage, modifiers: [slow], critMultiplier } = module.exports;
		let pendingDamage = damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		addModifier(target, slow);
		return `${dealDamage([target], user, pendingDamage, false, element, adventure)} ${target.getName(adventure.room.enemyIdMap)} is Slowed.`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setDamage(75)
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDurability(15);
