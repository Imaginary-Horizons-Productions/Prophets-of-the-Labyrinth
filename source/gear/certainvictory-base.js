const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Certain Victory",
	"Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0}; pay HP for your @{mod0}",
	"Damage x@{critMultiplier}",
	"Pact",
	"Earth",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], damage, critMultiplier } = module.exports;
		let pendingDamage = damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const addedPowerUp = addModifier(user, powerUp);
		return `${payHP(user, user.getModifierStacks("Power Up"), adventure)}${dealDamage([target], user, pendingDamage, false, element, adventure)}${addedPowerUp ? ` ${user.getName(adventure.room.enemyIdMap)} is Powered Up.` : ""}`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Hunter's Certain Victory", "Lethal Certain Victory", "Reckless Certain Victory")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setDamage(75);
