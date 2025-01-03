const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

const bounceCount = 3;
module.exports = new GearTemplate("Staggering Heat Weaken",
	[
		["use", `Inflict @{mod0Stacks} @{mod0} on ${bounceCount} random foes`],
		["Critical💥", "@{mod0} x @{critMultiplier}"]
	],
	"Spell",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [frailty], critMultiplier, stagger } = module.exports;
		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		changeStagger(targets, user, pendingStagger);
		const pendingFrailty = { ...frailty };
		if (user.crit) {
			pendingFrailty.stacks *= critMultiplier;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingFrailty))).concat(joinAsStatement(false, targets.map(target => target.name), "is", "are", "Staggered."));
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}${bounceCount}`, team: "foe" })
	.setSidegrades("Numbing Heat Weaken")
	.setCharges(15)
	.setModifiers({ name: "Frailty", stacks: 2 })
	.setStagger(2);
