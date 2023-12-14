const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Toxic Shortsword",
	"Strike a foe for @{damage} @{element} damage, then apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to the foe and @{mod0Stacks} @{mod0} to yourself",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [exposed, poison], damage, critMultiplier } = module.exports;
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
		const targetDebuffs = [];
		const addedPoison = addModifier(target, poison);
		if (addedPoison) {
			targetDebuffs.push("Poisoned");
		}
		const addedExposedTarget = addModifier(target, exposed);
		if (addedExposedTarget) {
			targetDebuffs.push("Exposed");
		}
		if (targetDebuffs.length > 0) {
			resultText += ` ${target.getName(adventure.room.enemyIdMap)} is ${listifyEN(targetDebuffs)}.`;
		}
		return resultText;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Shortsword")
	.setModifiers({ name: "Exposed", stacks: 1 }, { name: "Poison", stacks: 3 })
	.setDurability(15)
	.setDamage(40);
