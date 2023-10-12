const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { dealDamage, addModifier, payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reckless Certain Victory",
	"Strike a foe for @{damage} @{element} damage, gain @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2}; pay HP for your @{mod1}",
	"Damage x@{critBonus}",
	"Pact",
	"Earth",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, powerUp, exposed], damage, critBonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			damage *= critBonus;
		}
		addModifier(user, powerUp);
		addModifier(user, exposed);
		return `${payHP(user, user.getModifierStacks("Power Up"), adventure)}${dealDamage([target], user, damage, false, element, adventure)} ${user.getName(adventure.room.enemyIdMap)} is Powered Up and Exposed.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Hunter's Certain Victory", "Lethal Certain Victory")
	.setModifiers({ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }, { name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(125);
