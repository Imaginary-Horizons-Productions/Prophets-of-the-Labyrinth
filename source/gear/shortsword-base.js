const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Shortsword",
	"Strike a foe for @{damage} @{element} damage, then apply @{mod0Stacks} @{mod0} to both the foe and yourself",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Fire",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [exposed], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		let resultText = dealDamage([target], user, pendingDamage, false, element, adventure);
		const addedExposedUser = addModifier(user, exposed);
		if (addedExposedUser) {
			resultText += ` ${user.getName(adventure.room.enemyIdMap)} is Exposed.`;
		}
		const addedExposedTarget = addModifier(target, exposed);
		if (addedExposedTarget) {
			resultText += ` ${target.getName(adventure.room.enemyIdMap)} is Exposed.`;
		}
		return resultText;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Accelerating Shortsword", "Toxic Shortsword")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(40);
