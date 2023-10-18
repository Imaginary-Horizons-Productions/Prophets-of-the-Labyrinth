const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { addModifier, dealDamage, gainHealth } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Life Drain",
	"Strike a foe for @{damage} @{element} damage, then gain @{healing} hp",
	"Healing x@{critBonus}",
	"Spell",
	"Darkness",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], damage, healing, critBonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			healing *= critBonus;
		}
		return `${dealDamage([target], user, damage, false, element, adventure)} ${gainHealth(user, healing, adventure)}`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Flanking Life Drain", "Reactive Life Drain", "Urgent Life Drain")
	.setModifiers({ name: "Stagger", stacks: 1 })
	.setDurability(15)
	.setDamage(75)
	.setHealing(25);
