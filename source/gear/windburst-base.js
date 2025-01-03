const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Wind Burst",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a single foe"],
		["Critical💥", "@{mod0} x @{critMultiplier}"]
	],
	"Spell",
	"Wind",
	200,
	(targets, user, adventure) => {
		const { essence, modifiers: [distraction], critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const pendingDistraction = { name: distraction.name, stacks: distraction.stacks.generator(user) };
		if (user.crit) {
			pendingDistraction.stacks *= critMultiplier;
		}
		return generateModifierResultLines(addModifier(targets, pendingDistraction));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Inspiring Wind Burst", "Toxic Wind Burst")
	.setCharges(15)
	.setModifiers({ name: "Distraction", stacks: { description: "2 + Bonus Speed / 10", generator: (user) => 2 + Math.floor(user.getBonusSpeed() / 10) } });
