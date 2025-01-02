const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { discountedPassive } = require('./descriptions/passives');

module.exports = new GearTemplate("Discounted Midas Staff",
	[
		discountedPassive,
		["use", "Inflict @{mod0Stacks} @{mod0} on a single combatant"],
		["Critical💥", "@{mod0} + @{critMultiplier}"]
	],
	"Support",
	"Light",
	100,
	(targets, user, adventure) => {
		const { essence, modifiers: [curseOfMidas], critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, targets[0].team === user.team ? ESSENCE_MATCH_STAGGER_ALLY : ESSENCE_MATCH_STAGGER_FOE);
		}
		const pendingCurse = { ...curseOfMidas };
		if (user.crit) {
			pendingCurse.stacks += critMultiplier;
		}
		return generateModifierResultLines(addModifier(targets, pendingCurse));
	}
).setTargetingTags({ type: "single", team: "any" })
	.setSidegrades("Accelerating Midas Staff")
	.setCooldown(1)
	.setModifiers({ name: "Curse of Midas", stacks: 2 })
	.setCritMultiplier(1);
