const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, payHP, changeStagger, getNames } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Reckless Certain Victory",
	"Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}; pay HP for your @{mod0}",
	"Damage x@{critMultiplier}",
	"Pact",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerUp, exposed], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultSentences = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		const addedModifiers = [];
		const addedPowerUp = addModifier([user], powerUp).length > 0;
		if (addedPowerUp) {
			addedModifiers.push("Powered Up");
		}
		const addedExposed = addModifier([user], exposed).length > 0;
		if (addedExposed) {
			addedModifiers.push("Exposed");
		}
		if (addedModifiers.length > 0) {
			resultSentences.push(`${getNames([user], adventure)[0]} is ${listifyEN(addedModifiers)}.`);
		}
		resultSentences.push(payHP(user, user.getModifierStacks("Power Up"), adventure));
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Hunter's Certain Victory", "Lethal Certain Victory")
	.setModifiers({ name: "Power Up", stacks: 25 }, { name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(90);
