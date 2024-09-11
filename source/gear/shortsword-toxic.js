const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Toxic Shortsword",
	[
		["use", "Strike a foe for @{damage} @{element} damage, then apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to the foe and @{mod0Stacks} @{mod0} to yourself"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [exposed, poison], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		let resultText = dealDamage([target], user, pendingDamage, false, element, adventure);
		const addedExposedUser = addModifier([user], exposed).length > 0;
		if (addedExposedUser) {
			resultText += ` ${getNames([user], adventure)[0]} is Exposed.`;
		}
		const targetDebuffs = [];
		if (target.hp > 0) {
			if (user.element === element) {
				changeStagger([target], "elementMatchFoe");
			}
			const addedPoison = addModifier([target], poison).length > 0;
			if (addedPoison) {
				targetDebuffs.push("Poisoned");
			}
			const addedExposedTarget = addModifier([target], exposed).length > 0;
			if (addedExposedTarget) {
				targetDebuffs.push("Exposed");
			}
			if (targetDebuffs.length > 0) {
				resultText += ` ${getNames([target], adventure)[0]} is ${listifyEN(targetDebuffs, false)}.`;
			}
		}
		return resultText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Shortsword", "Lethal Shortsword")
	.setModifiers({ name: "Exposed", stacks: 1 }, { name: "Poison", stacks: 3 })
	.setDurability(15)
	.setDamage(40);
