const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_ALLY } = require('../constants.js');
const { addModifier, payHP, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Fate-Sealing Infinite Regeneration",
	[
		["use", "Pay @{hpCost} HP to grant an ally @{mod0Stacks} @{mod0}"],
		["Critical💥", "HP Cost / @{critMultiplier} and grant @{mod1Stacks} @{mod1}"]
	],
	"Pact",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [regen, stasis], hpCost, critMultiplier } = module.exports;
		let pendingHPCost = hpCost;
		const paymentSentence = payHP(user, pendingHPCost, adventure);
		if (adventure.lives < 1) {
			return [paymentSentence];
		}
		const resultLines = [paymentSentence];
		const receipts = addModifier(targets, regen);
		if (user.crit) {
			pendingHPCost /= critMultiplier;
			receipts.push(...addModifier(targets, stasis));
		}
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Discounted Infinite Regeneration", "Purifying Infinite Regeneration")
	.setModifiers({ name: "Regen", stacks: 4 }, { name: "Retain", stacks: 1 })
	.setHPCost(50);
