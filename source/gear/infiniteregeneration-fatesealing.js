const { GearTemplate } = require('../classes');
const { addModifier, payHP, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Fate-Sealing Infinite Regeneration",
	[
		["use", "Pay @{hpCost} HP to grant an ally @{mod0Stacks} @{mod0}"],
		["Critical💥", "HP Cost / @{critMultiplier} and grant @{mod1Stacks} @{mod1}"]
	],
	"Pact",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [regen, stasis], hpCost, critMultiplier } = module.exports;
		let pendingHPCost = hpCost;
		const paymentSentence = payHP(user, pendingHPCost, adventure);
		if (adventure.lives < 1) {
			return paymentSentence;
		}
		const resultLines = [paymentSentence];
		if (isCrit) {
			pendingHPCost /= critMultiplier;
			resultLines.push(...addModifier(targets, stasis));
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		resultLines.push(...addModifier(targets, regen));
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Discounted Infinite Regeneration", "Purifying Infinite Regeneration")
	.setModifiers({ name: "Regen", stacks: 4 }, { name: "Retain", stacks: 1 })
	.setHPCost(50)
	.setDurability(10);
