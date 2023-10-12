const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Spear",
	"Strike a foe for @{damage} @{element} damage",
	"Also inflict @{mod1Stacks} @{mod1}",
	"Weapon",
	"Wind",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, critStagger], damage } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			addModifier(target, critStagger);
		}
		return dealDamage([target], user, damage, false, element, adventure);
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Lethal Spear", "Reactive Spear", "Sweeping Spear")
	.setModifiers({ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 })
	.setDurability(15)
	.setDamage(100);
