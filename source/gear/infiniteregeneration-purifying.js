const { GearTemplate } = require('../classes/index.js');
const { ELEMENT_MATCH_STAGGER_ALLY } = require('../constants.js');
const { getModifierCategory } = require('../modifiers/_modifierDictionary.js');
const { addModifier, payHP, changeStagger, removeModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Purifying Infinite Regeneration",
	[
		["use", "Grant an ally @{mod0Stacks} @{mod0} and cure all their debuffs"],
		["Critical💥", "HP Cost / @{critMultiplier}"]
	],
	"Pact",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [regen], pactCost: [pactCostValue], critMultiplier } = module.exports;
		let pendingHPCost = pactCostValue;
		if (user.crit) {
			pendingHPCost /= critMultiplier;
		}
		const paymentSentence = payHP(user, pendingHPCost, adventure);
		if (adventure.lives < 1) {
			return [paymentSentence];
		}
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		const resultLines = [paymentSentence];
		const receipts = addModifier(targets, regen);
		for (const target of targets) {
			Object.keys(target.modifiers).forEach(modifier => {
				if (getModifierCategory(modifier) === "Debuff") {
					receipts.push(...removeModifier([target], { name: modifier, stacks: "all" }));
				}
			})
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setUpgrades("Discounted Infinite Regeneration", "Fate-Sealing Infinite Regeneration")
	.setModifiers({ name: "Regen", stacks: 4 })
	.setPactCost([50, "@{pactCost} HP"]);
