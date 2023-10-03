const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sweeping Spear",
	"Strike all foes for @{damage} @{element} damage",
	"Also inflict @{mod1Stacks} @{mod1}",
	"Weapon",
	"Wind",
	350,
	needsLivingTargets((targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, critStagger], damage } = module.exports;
		targets.map(target => {
			if (user.element === element) {
				addModifier(target, elementStagger);
			}
			if (isCrit) {
				addModifier(target, critStagger);
			}
		})
		return dealDamage(targets, user, damage, false, element, adventure);
	})
).setTargetingTags({ target: "all", team: "enemy" })
	.setSidegrades("Lethal Spear", "Reactive Spear")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setDurability(15)
	.setDamage(75);
