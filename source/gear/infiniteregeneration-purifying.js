const { GearTemplate } = require('../classes/index.js');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');
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
		const { essence, modifiers: [regeneration], pactCost: [pactCostValue], critMultiplier } = module.exports;
		let pendingHPCost = pactCostValue;
		if (user.crit) {
			pendingHPCost /= critMultiplier;
		}
		const resultLines = payHP(user, pendingHPCost, adventure);
		if (adventure.lives < 1) {
			return resultLines;
		}
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const receipts = addModifier(targets, regeneration);
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
	.setModifiers({ name: "Regeneration", stacks: 4 })
	.setPactCost([50, "@{pactCost} HP"])
	.setCooldown(0);
