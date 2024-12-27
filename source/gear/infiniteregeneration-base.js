const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');
const { addModifier, payHP, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Infinite Regeneration",
	[
		["use", "Grant an ally @{mod0Stacks} @{mod0}"],
		["Critical💥", "HP Cost / @{critMultiplier}"]
	],
	"Pact",
	"Fire",
	200,
	(targets, user, adventure) => {
		const { essence, modifiers: [regeneration], pactCost: [pactCostValue], critMultiplier } = module.exports;
		let pendingHPCost = pactCostValue;
		if (user.crit) {
			pendingHPCost /= critMultiplier;
		}
		const paymentSentence = payHP(user, pendingHPCost, adventure);
		if (adventure.lives < 1) {
			return [paymentSentence];
		}
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		return [paymentSentence, ...generateModifierResultLines(addModifier(targets, regeneration))];
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setUpgrades("Discounted Infinite Regeneration", "Fate-Sealing Infinite Regeneration", "Purifying Infinite Regeneration")
	.setModifiers({ name: "Regeneration", stacks: 4 })
	.setPactCost([50, "@{pactCost} HP"])
	.setCooldown(0);
