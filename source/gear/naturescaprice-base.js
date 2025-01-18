const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Nature's Caprice",
	[
		["use", "Grant @{mod0Stacks} @{mod0} to a combatant"],
		["Critical💥", "Instead inflict @{mod1Stacks} @{mod1}"]
	],
	"Spell",
	"Earth"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [fortune, misfortune] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, user.team === targets[0].team ? ESSENCE_MATCH_STAGGER_ALLY : ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			return generateModifierResultLines(addModifier(targets, misfortune));
		} else {
			return generateModifierResultLines(addModifier(targets, fortune));
		}
	}, { type: "single", team: "any" })
	.setUpgrades("Accurate Nature's Caprice", "Hearty Nature's Caprice")
	.setCharges(15)
	.setModifiers({ name: "Fortune", stacks: 9 }, { name: "Misfortune", stacks: 9 });
