const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Accelerating Shortsword",
	"Strike a foe for @{damage} @{element} damage, then apply @{mod1Stacks} @{mod1} to the foe and @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2} to yourself",
	"Damage x@{critBonus}",
	"Weapon",
	"Fire",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, exposed, quicken], damage, critBonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			damage *= critBonus;
		}
		const damageText = dealDamage([target], user, damage, false, element, adventure);
		addModifier(user, exposed);
		addModifier(user, quicken);
		addModifier(target, exposed);
		return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Exposed. ${user.getName(adventure.room.enemyIdMap)} is Quickened and Exposed.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Toxic Shortsword")
	.setModifiers({ name: "Stagger", stacks: 1 }, { name: "Exposed", stacks: 1 }, { name: "Quicken", stacks: 1 })
	.setDurability(15)
	.setDamage(75);
