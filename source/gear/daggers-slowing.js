const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Slowing Daggers",
	"Strike a foe for @{damage} @{element} damage and inflict @{mod0Stacks} @{mod0}",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Wind",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [slow], damage, critMultiplier } = module.exports;
		let pendingDamage = damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const addedSlow = addModifier(target, slow);
		return `${dealDamage([target], user, pendingDamage, false, element, adventure)}${addedSlow ? ` ${target.getName(adventure.room.enemyIdMap)} is Slowed.` : ""}`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Sharpened Daggers", "Sweeping Daggers")
	.setModifiers({ name: "Slow", stacks: 1 })
	.setDurability(15)
	.setCritMultiplier(3)
	.setDamage(75);
