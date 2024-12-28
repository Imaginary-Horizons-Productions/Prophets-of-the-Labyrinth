const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');
const { addModifier, payHP, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Discounted Infinite Regeneration",
	[
		["use", "Grant an ally @{mod0Stacks} @{mod0}"],
		["Critical💥", "HP Cost / @{critMultiplier}"]
	],
	"Pact",
	"Fire",
	100,
	(targets, user, adventure) => {
		const { essence, modifiers: [regeneration], pactCost: [pactCostValue], critMultiplier } = module.exports;
		let pendingHPCost = pactCostValue;
		if (user.crit) {
			pendingHPCost /= critMultiplier;
		}
		const paymentLines = payHP(user, pendingHPCost, adventure);
		if (adventure.lives < 1) {
			return paymentLines;
		}
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		return paymentLines.concat(generateModifierResultLines(addModifier(targets, regeneration)));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Fate-Sealing Infinite Regeneration", "Purifying Infinite Regeneration")
	.setModifiers({ name: "Regeneration", stacks: 4 })
	.setPactCost([50, "@{pactCost} HP"])
	.setCooldown(0);
