const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_ALLY, ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Soothing Midas Staff",
	[
		["use", "Apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to a combatant"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
	"Trinket",
	"Water",
	350,
	([target], user, adventure) => {
		const { element, modifiers: [curse, regen], bonus } = module.exports;
		const pendingCurse = { ...curse };
		if (user.crit) {
			pendingCurse.stacks += bonus;
		}
		if (user.element === element) {
			if (target.team === user.team) {
				changeStagger([target], user, ELEMENT_MATCH_STAGGER_ALLY);
			} else {
				changeStagger([target], user, ELEMENT_MATCH_STAGGER_FOE);
			}
		}
		const receipts = addModifier([target], pendingCurse).concat(addModifier([target], regen));
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setTargetingTags({ type: "single", team: "any" })
	.setSidegrades("Accelerating Midas Staff", "Discounted Midas Staff")
	.setModifiers({ name: "Curse of Midas", stacks: 2 }, { name: "Regen", stacks: 2 })
	.setBonus(1) // Curse of Midas stacks
	.setCooldown(2);
