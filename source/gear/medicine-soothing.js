const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_ALLY } = require('../constants');
const { addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Soothing Medicine",
	[
		["use", "Grant an ally @{mod0Stacks} @{mod0}"],
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
		return generateModifierResultLines(addModifier(targets, pendingRegen));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Bouncing Medicine", "Cleansing Medicine")
	.setModifiers({ name: "Regen", stacks: 5 })
	.setCooldown(1);
