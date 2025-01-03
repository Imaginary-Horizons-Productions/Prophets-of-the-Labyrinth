const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

const bounceCount = 3;
module.exports = new GearTemplate("Heat Weaken",
	[
		["use", `Inflict @{mod0Stacks} @{mod0} on ${bounceCount} random foes`],
		["Critical💥", "@{mod0} x @{critMultiplier}"]
	],
	"Spell",
	"Fire",
	200,
	(targets, user, adventure) => {
		const { essence, modifiers: [frailty], critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const pendingFrailty = { ...frailty };
		if (user.crit) {
			pendingFrailty.stacks *= critMultiplier;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingFrailty)));
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}${bounceCount}`, team: "foe" })
	.setUpgrades("Numbing Heat Weaken", "Staggering Heat Weaken")
	.setCharges(15)
	.setModifiers({ name: "Frailty", stacks: 2 });
