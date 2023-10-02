const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { addModifier, dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sharpened Daggers",
	"Strike a foe for @{damage} @{element} damage",
	"Damage x@{critBonus}",
	"Weapon",
	"Wind",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], damage, critBonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			damage *= critBonus;
		}
		return dealDamage([target], user, damage, false, element, adventure);
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Sweeping Daggers", "Slowing Daggers")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability(15)
	.setCritBonus(3)
	.setDamage(100);
