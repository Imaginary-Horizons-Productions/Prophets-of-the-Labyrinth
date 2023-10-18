const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { dealDamage, addModifier, payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Hunter's Certain Victory",
	"Strike a foe for @{damage} @{element} damage, gain @{mod1Stacks} @{mod1} (@{bonus}g on kill); pay HP for your @{mod1}",
	"Damage x@{critBonus}",
	"Pact",
	"Earth",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, powerUp], damage, bonus: bounty, critBonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			damage *= critBonus;
		}
		addModifier(user, powerUp);
		let damageText = dealDamage([target], user, damage, false, element, adventure);
		if (target.hp < 1) {
			adventure.gainGold(bounty);
			damageText += ` ${user.getName(adventure.room.enemyIdMap)} gains ${bounty}g of victory spoils.`;
		}
		return `${payHP(user, user.getModifierStacks("Power Up"), adventure)}${damageText} ${user.getName(adventure.room.enemyIdMap)} is Powered Up.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Lethal Certain Victory", "Reckless Certain Victory")
	.setModifiers({ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setDamage(75)
	.setBonus(15);
