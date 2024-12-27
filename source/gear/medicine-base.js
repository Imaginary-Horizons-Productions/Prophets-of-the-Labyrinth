const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Medicine",
	[
		["use", "Grant an ally @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	200,
	(targets, user, adventure) => {
		const { modifiers: [regeneration], critMultiplier, essence } = module.exports;
		const pendingRegen = { ...regeneration };
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingRegen.stacks *= critMultiplier;
		}
		return generateModifierResultLines(addModifier(targets, pendingRegen));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setUpgrades("Bouncing Medicine", "Cleansing Medicine", "Soothing Medicine")
	.setModifiers({ name: "Regeneration", stacks: 3 })
	.setCooldown(1);
