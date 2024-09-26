const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, payHP, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Lethal Certain Victory",
	[
		["use", "Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0}; pay HP for your @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		const addedPowerUp = addModifier([user], powerUp).length > 0;
		if (addedPowerUp) {
			resultLines.push(`${user.name} gains ${getApplicationEmojiMarkdown("Power Up")}.`);
		}
		resultLines.push(payHP(user, user.getModifierStacks("Power Up"), adventure));
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Hunter's Certain Victory", "Reckless Certain Victory")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setDamage(40)
	.setCritMultiplier(3);
