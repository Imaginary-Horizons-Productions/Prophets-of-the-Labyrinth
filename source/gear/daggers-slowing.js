const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Slowing Daggers",
	"Strike a foe for @{damage} @{element} damage and inflict @{mod0Stacks} @{mod0}",
	"Damage x@{critBonus}",
	"Weapon",
	"Wind",
	350, needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [slow], damage, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critBonus;
		}
		addModifier(target, slow);
		return `${dealDamage([target], user, damage, false, element, adventure)} ${target.getName(adventure.room.enemyIdMap)} is Slowed.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Sharpened Daggers", "Sweeping Daggers")
	.setModifiers({ name: "Slow", stacks: 1 })
	.setDurability(15)
	.setCritBonus(3)
	.setDamage(75);
