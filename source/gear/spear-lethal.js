const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Lethal Spear",
	"Strike a foe for @{damage} @{element} damage",
	"Damage x@{critBonus}, also inflict @{mod1Stacks} @{mod1}",
	"Weapon",
	"Wind",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, critStagger], damage, critBonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			damage *= critBonus;
			addModifier(target, critStagger);
		}
		return dealDamage([target], user, damage, false, element, adventure);
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Reactive Spear", "Sweeping Spear")
	.setModifiers({ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 })
	.setDurability(15)
	.setDamage(100);
