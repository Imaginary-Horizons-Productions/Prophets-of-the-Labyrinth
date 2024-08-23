const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, payHP, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Certain Victory",
	"Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0}; pay HP for your @{mod0}",
	"Damage x@{critMultiplier}",
	"Pact",
	"Earth",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultSentences = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		const addedPowerUp = addModifier([user], powerUp).length > 0;
		if (addedPowerUp) {
			resultSentences.push(`${getNames([user], adventure)[0]} is Powered Up.`);
		}
		resultSentences.push(payHP(user, user.getModifierStacks("Power Up"), adventure));
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Hunter's Certain Victory", "Lethal Certain Victory", "Reckless Certain Victory")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setDamage(40);
