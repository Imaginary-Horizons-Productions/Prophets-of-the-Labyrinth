const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Shortsword",
	"Strike a foe for @{damage} @{element} damage, then apply @{mod1Stacks} @{mod1} to both the foe and yourself",
	"Damage x@{critBonus}",
	"Weapon",
	"Fire",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, exposed], damage, critBonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			damage *= critBonus;
		}
		const damageText = dealDamage([target], user, damage, false, element, adventure);
		addModifier(user, exposed);
		addModifier(target, exposed);
		return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Exposed. ${user.getName(adventure.room.enemyIdMap)} is Exposed.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Accelerating Shortsword", "Toxic Shortsword")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Exposed", stacks: 1 }])
	.setDurability(15)
	.setDamage(75);
