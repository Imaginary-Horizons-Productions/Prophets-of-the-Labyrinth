const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ELEMENT_MATCH_STAGGER_ALLY } = require('../constants');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Bouncing Medicine",
	[
		["use", "Grant 3 random allies @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, adventure) => {
		const { modifiers: [regen], critMultiplier, element } = module.exports;
		const pendingRegen = { ...regen };
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingRegen.stacks *= critMultiplier;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingRegen)));
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}3`, team: "ally" })
	.setSidegrades("Cleansing Medicine", "Soothing Medicine")
	.setModifiers({ name: "Regen", stacks: 3 })
	.setCooldown(1)
	.setRnConfig({ "allies": 3 });
