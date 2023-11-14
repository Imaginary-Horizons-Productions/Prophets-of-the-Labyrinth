const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Toxic Shortsword",
	"Strike a foe for @{damage} @{element} damage, then apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to the foe and @{mod0Stacks} @{mod0} to yourself",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [exposed, poison], damage, critMultiplier } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critMultiplier;
		}
		const damageText = dealDamage([target], user, damage, false, element, adventure);
		addModifier(user, exposed);
		addModifier(target, poison);
		addModifier(target, exposed);
		return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Poisoned and Exposed. ${user.getName(adventure.room.enemyIdMap)} is Exposed.`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Shortsword")
	.setModifiers({ name: "Exposed", stacks: 1 }, { name: "Poison", stacks: 3 })
	.setDurability(15)
	.setDamage(75);
