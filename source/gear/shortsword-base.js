const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Shortsword",
	"Strike a foe for @{damage} @{element} damage, then apply @{mod0Stacks} @{mod0} to both the foe and yourself",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Fire",
	200,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [exposed], damage, critMultiplier } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critMultiplier;
		}
		const damageText = dealDamage([target], user, damage, false, element, adventure);
		addModifier(user, exposed);
		addModifier(target, exposed);
		return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Exposed. ${user.getName(adventure.room.enemyIdMap)} is Exposed.`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Accelerating Shortsword", "Toxic Shortsword")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(75);
