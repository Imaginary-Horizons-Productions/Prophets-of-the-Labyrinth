const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Inspiring Wind Burst",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a single foe and increase party's morale by @{bonus}"],
		["Critical💥", "@{mod0} x @{critMultiplier}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [distraction], critMultiplier, bonus } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const pendingDistraction = { name: distraction.name, stacks: distraction.stacks.generator(user) };
		if (user.crit) {
			pendingDistraction.stacks *= critMultiplier;
		}
		adventure.room.morale += bonus;
		return generateModifierResultLines(addModifier(targets, pendingDistraction)).concat("The party's morale is increased!");
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Toxic Wind Burst")
	.setCharges(15)
	.setModifiers({ name: "Distraction", stacks: { description: "2 + Bonus Speed ÷ 10", generator: (user) => 2 + Math.floor(user.getBonusSpeed() / 10) } })
	.setBonus(1);
