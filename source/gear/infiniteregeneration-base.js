const { GearTemplate } = require('../classes');
const { addModifier, payHP, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Infinite Regeneration",
	[
		["use", "Pay @{hpCost} HP to grant an ally @{mod0Stacks} @{mod0}"],
		["Critical💥", "HP Cost / @{critMultiplier}"]
	],
	"Pact",
	"Fire",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [regen], hpCost, critMultiplier } = module.exports;
		let pendingHPCost = hpCost;
		if (isCrit) {
			pendingHPCost /= critMultiplier;
		}
		const paymentSentence = payHP(user, pendingHPCost, adventure);
		if (adventure.lives < 1) {
			return [paymentSentence];
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		return [paymentSentence, ...generateModifierResultLines(addModifier(targets, regen))];
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Discounted Infinite Regeneration", "Fate-Sealing Infinite Regeneration", "Purifying Infinite Regeneration")
	.setModifiers({ name: "Regen", stacks: 4 })
	.setHPCost(50)
	.setDurability(10);
