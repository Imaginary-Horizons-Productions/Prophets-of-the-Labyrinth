const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Lethal Certain Victory",
	"Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0}; pay HP for your @{mod0}",
	"Damage x@{critBonus}",
	"Pact",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [powerUp], damage, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critBonus;
		}
		addModifier(user, powerUp);
		return `${payHP(user, user.getModifierStacks("Power Up"), adventure)}${dealDamage([target], user, damage, false, element, adventure)} ${user.getName(adventure.room.enemyIdMap)} is Powered Up.`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Hunter's Certain Victory", "Reckless Certain Victory")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setDamage(75)
	.setCritBonus(3);
