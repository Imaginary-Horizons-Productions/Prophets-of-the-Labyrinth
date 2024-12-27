const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
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
		const { essence, modifiers: [poison, regeneration, curseOfMidas] } = module.exports;
		if (user.essence === essence) {
			if (target.team === user.team) {
				changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
			} else {
				changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
			}
		}
		const receipts = addModifier([target], curseOfMidas);
		if (user.crit) {
			receipts.unshift(...addModifier([target], regeneration));
		} else {
			receipts.unshift(...addModifier([target], poison));
		}
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setTargetingTags({ type: "single", team: "any" })
	.setSidegrades("Chaining Risky Mixture", "Potent Risky Mixture")
	.setModifiers({ name: "Poison", stacks: 4 }, { name: "Regeneration", stacks: 4 }, { name: "Curse of Midas", stacks: 1 })
	.setCooldown(1);
