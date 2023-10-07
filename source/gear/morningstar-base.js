const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Morning Star",
	"Strike a foe applying @{mod1Stacks} @{mod1} and @{damage} @{element} damage",
	"Damage x@{critBonus}",
	"Weapon",
	"Light",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, stagger], damage, critBonus } = module.exports;
		let pendingDamage = damage;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			pendingDamage *= critBonus;
		}
		addModifier(target, stagger);
		return `${dealDamage([target], user, pendingDamage, false, element, adventure)} ${target.getName(adventure.room.enemyIdMap)} is Staggered.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setDurability(15)
	.setDamage(75);
