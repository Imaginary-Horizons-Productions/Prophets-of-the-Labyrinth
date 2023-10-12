const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Lance",
	"Strike a foe for @{damage} @{element} damage (double increase from Power Up)",
	"Damage x@{critBonus}",
	"Weapon",
	"Earth",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], damage, critBonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		const powerUpStacks = user.getModifierStacks("Power Up");
		damage += powerUpStacks;
		if (isCrit) {
			damage *= critBonus;
			damage += powerUpStacks;
		}
		return dealDamage([target], user, damage, false, element, adventure);
	})
).setUpgrades("Accelerating Lance", "Piercing Lance", "Vigilant Lance")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers({ name: "Stagger", stacks: 1 })
	.setDurability(15)
	.setDamage(75);
