const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Toxic Shortsword",
	"Strike a foe for @{damage} @{element} damage, then apply @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2} to the foe and @{mod1Stacks} @{mod1} to yourself",
	"Damage x@{critBonus}",
	"Weapon",
	"Fire",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, exposed, poison], damage, critBonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			damage *= critBonus;
		}
		addModifier(user, exposed);
		addModifier(target, poison);
		addModifier(target, exposed);
		return `${dealDamage([target], user, damage, false, element, adventure)} ${target.getName(adventure.room.enemyIdMap)} is Poisoned. ${user.getName(adventure.room.enemyIdMap)} is Exposed.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Accelerating Shortsword")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Exposed", stacks: 1 }, { name: "Poison", stacks: 3 }])
	.setDurability(15)
	.setDamage(75);
