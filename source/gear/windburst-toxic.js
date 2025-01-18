const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Toxic Wind Burst",
	[
		["use", "Inflict <@{mod0Stacks}> @{mod0} and @{mod1Stacks} @{mod1} on a single foe"],
		["Critical💥", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Wind"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [distraction, poison], scalings: { critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const pendingDistraction = { name: distraction.name, stacks: distraction.stacks.calculate(user) };
		if (user.crit) {
			pendingDistraction.stacks *= critBonus;
		}
		return generateModifierResultLines(addModifier(targets, pendingDistraction).concat(addModifier(targets, poison)));
	}, { type: "single", team: "foe" })
	.setSidegrades("Inspiring Wind Burst")
	.setCharges(15)
	.setModifiers({ name: "Distraction", stacks: { description: "2 + 10% Bonus Speed", calculate: (user) => 2 + Math.floor(user.getBonusSpeed() / 10) } }, { name: "Poison", stacks: 3 })
	.setScalings({ critBonus: 2 });
