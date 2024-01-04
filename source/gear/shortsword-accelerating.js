const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Accelerating Shortsword",
	"Strike a foe for @{damage} @{element} damage, then apply @{mod0Stacks} @{mod0} to the foe and @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to yourself",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [exposed, quicken], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		let resultText = dealDamage([target], user, pendingDamage, false, element, adventure);
		const selfModifiers = [];
		const addedExposedUser = addModifier(user, exposed);
		if (addedExposedUser) {
			selfModifiers.push("Exposed");
		}
		const addedQuicken = addModifier(user, quicken);
		if (addedQuicken) {
			selfModifiers.push("Quickened");
		}
		if (selfModifiers.length > 0) {
			resultText += ` ${user.getName(adventure.room.enemyIdMap)} is ${listifyEN(selfModifiers)}.`;
		}
		const addedExposedTarget = addModifier(target, exposed);
		if (addedExposedTarget) {
			resultText += ` ${target.getName(adventure.room.enemyIdMap)} is Exposed.`;
		}
		return resultText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Toxic Shortsword")
	.setModifiers({ name: "Exposed", stacks: 1 }, { name: "Quicken", stacks: 1 })
	.setDurability(15)
	.setDamage(40);
