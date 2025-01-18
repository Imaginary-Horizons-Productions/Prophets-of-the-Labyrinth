const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Inspiring Wind Burst",
	[
		["use", "Inflict <@{mod0Stacks}> @{mod0} on a single foe and increase party's morale by @{morale}"],
		["Critical💥", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Wind"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [distraction], scalings: { critBonus, morale } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const pendingDistraction = { name: distraction.name, stacks: distraction.stacks.calculate(user) };
		if (user.crit) {
			pendingDistraction.stacks *= critBonus;
		}
		adventure.room.morale += morale;
		return generateModifierResultLines(addModifier(targets, pendingDistraction)).concat("The party's morale is increased!");
	}, { type: "single", team: "foe" })
	.setSidegrades("Toxic Wind Burst")
	.setCharges(15)
	.setModifiers({ name: "Distraction", stacks: { description: "2 + 10% Bonus Speed", calculate: (user) => 2 + Math.floor(user.getBonusSpeed() / 10) } })
	.setScalings({
		critBonus: 2,
		morale: 1
	});
