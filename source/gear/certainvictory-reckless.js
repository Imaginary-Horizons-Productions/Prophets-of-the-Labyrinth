const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reckless Certain Victory",
	"Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}; pay HP for your @{mod0}",
	"Damage x@{critMultiplier}",
	"Pact",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerUp, exposed], damage, critMultiplier } = module.exports;
		let pendingDamage = damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const addedPowerUp = addModifier(user, powerUp);
		const addedExposed = addModifier(user, exposed);
		if (addedPowerUp) {
			return `${payHP(user, user.getModifierStacks("Power Up"), adventure)}${dealDamage([target], user, pendingDamage, false, element, adventure)} ${user.getName(adventure.room.enemyIdMap)} is Powered Up and Exposed.`;
		} else if (addedExposed) {
			return `${payHP(user, user.getModifierStacks("Power Up"), adventure)}${dealDamage([target], user, pendingDamage, false, element, adventure)} ${user.getName(adventure.room.enemyIdMap)} is Exposed.`;
		} else {
			return `${payHP(user, user.getModifierStacks("Power Up"), adventure)}${dealDamage([target], user, pendingDamage, false, element, adventure)}`;
		}
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Hunter's Certain Victory", "Lethal Certain Victory")
	.setModifiers({ name: "Power Up", stacks: 25 }, { name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(90);
