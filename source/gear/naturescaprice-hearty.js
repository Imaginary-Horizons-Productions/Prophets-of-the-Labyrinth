const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { heartyPassive } = require('./descriptions/passives');

module.exports = new GearTemplate("Hearty Nature's Caprice",
	[
		heartyPassive,
		["use", "Grant @{mod0Stacks} @{mod0}"],
		["Critical💥", "Instead inflict @{mod1Stacks} @{mod1}"]
	],
	"Spell",
	"Earth",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [fortune, misfortune] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, user.team === targets[0].team ? ESSENCE_MATCH_STAGGER_ALLY : ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			return generateModifierResultLines(addModifier(targets, misfortune));
		} else {
			return generateModifierResultLines(addModifier(targets, fortune));
		}
	}
).setTargetingTags({ type: "single", team: "any" })
	.setUpgrades("Accurate Nature's Caprice", "Hearty Nature's Caprice")
	.setCharges(15)
	.setModifiers({ name: "Fortune", stacks: 9 }, { name: "Misfortune", stacks: 9 })
	.setMaxHP(10);