const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Chaining Risky Mixture",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a target"],
		["Critical💥", "Apply @{mod1} instead of @{mod0}"]
	],
	"Trinket",
	"Darkness",
	350,
	([target], user, adventure) => {
		const { essence, modifiers: [poison, regeneration] } = module.exports;
		if (user.essence === essence) {
			if (target.team === user.team) {
				changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
			} else {
				changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
			}
		}
		if (user.crit) {
			return generateModifierResultLines(addModifier([target], regeneration));
		} else {
			return generateModifierResultLines(addModifier([target], poison));
		}
	}
).setTargetingTags({ type: "single", team: "any" })
	.setSidegrades("Potent Risky Mixture", "Midas's Risky Mixture")
	.setModifiers({ name: "Poison", stacks: 4 }, { name: "Regeneration", stacks: 4 });
