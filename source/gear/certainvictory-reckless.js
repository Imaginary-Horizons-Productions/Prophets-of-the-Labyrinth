const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, payHP, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Reckless Certain Victory",
	[
		["use", "Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}; pay HP for your @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
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
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const addedModifiers = [];
		const addedPowerUp = user.getModifierStacks("Oblivious") < 1;
		addModifier([user], powerUp);
		if (addedPowerUp) {
			addedModifiers.push(getApplicationEmojiMarkdown("Power Up"));
		}
		const addedExposed = user.getModifierStacks("Oblivious") < 1;
		addModifier([user], exposed);
		if (addedExposed) {
			addedModifiers.push(getApplicationEmojiMarkdown("Exposed"));
		}
		if (addedModifiers.length > 0) {
			resultLines.push(`${user.name} gains ${addedModifiers.join("")}.`);
		}
		resultLines.push(payHP(user, user.getModifierStacks("Power Up"), adventure));
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Hunter's Certain Victory", "Lethal Certain Victory")
	.setModifiers({ name: "Power Up", stacks: 25 }, { name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(90);
