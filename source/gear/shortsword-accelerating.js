const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { listifyEN, joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Accelerating Shortsword",
	"Strike a foe for @{damage} @{element} damage, then apply @{mod0Stacks} @{mod0} to the foe and @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to yourself",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [exposed, quicken], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		let resultText = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const selfModifiers = [];
		const addedExposedUser = addModifier([user], exposed).length > 0;
		if (addedExposedUser) {
			selfModifiers.push("Exposed");
		}
		const addedQuicken = addModifier([user], quicken).length > 0;
		if (addedQuicken) {
			selfModifiers.push("Quickened");
		}
		if (selfModifiers.length > 0) {
			resultText += ` ${getNames([user], adventure)[0]} is ${listifyEN(selfModifiers, false)}.`;
		}
		const exposedTargets = addModifier(targets, exposed);
		if (exposedTargets.length > 0) {
			resultText += ` ${joinAsStatement(false, getNames(exposedTargets, adventure), "is", "are", "Exposed.")}`;
		}
		return resultText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Shortsword", "Toxic Shortsword")
	.setModifiers({ name: "Exposed", stacks: 1 }, { name: "Quicken", stacks: 1 })
	.setDurability(15)
	.setDamage(40);
