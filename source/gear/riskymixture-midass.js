const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_ALLY, ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Midas's Risky Mixture",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} and @{mod2Stacks} @{mod2} on a target"],
		["Critical💥", "Apply @{mod1} instead of @{mod0}"]
	],
	"Trinket",
	"Darkness",
	350,
	([target], user, adventure) => {
		const { element, modifiers: [poison, regen, curseOfMidas] } = module.exports;
		if (user.element === element) {
			if (target.team === user.team) {
				changeStagger([target], user, ELEMENT_MATCH_STAGGER_ALLY);
			} else {
				changeStagger([target], user, ELEMENT_MATCH_STAGGER_FOE);
			}
		}
		const receipts = addModifier([target], curseOfMidas);
		if (user.crit) {
			receipts.unshift(...addModifier([target], regen));
		} else {
			receipts.unshift(...addModifier([target], poison));
		}
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setTargetingTags({ type: "single", team: "any" })
	.setSidegrades("Chaining Risky Mixture", "Potent Risky Mixture")
	.setModifiers({ name: "Poison", stacks: 4 }, { name: "Regen", stacks: 4 }, { name: "Curse of Midas", stacks: 1 })
	.setCooldown(1);
