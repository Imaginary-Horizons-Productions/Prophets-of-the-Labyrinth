const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../util/actionComponents');
// const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new GearTemplate("Piercing Lance",
	"Strike a foe for @{damage} @{element} unblockable damage (double increase from Power Up)",
	"Damage x@{critBonus}",
	"Weapon",
	"Earth",
	350,
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
		return dealDamage([target], user, damage, true, element, adventure);
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Accelerating Lance", "Vigilant Lance")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability(15)
	.setDamage(75);
