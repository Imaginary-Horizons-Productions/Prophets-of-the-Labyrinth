const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Risky Mixture",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a target"],
		["Critical💥", "Apply @{mod1} instead of @{mod0}"]
	],
	"Trinket",
	"Darkness",
	200,
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
	.setUpgrades("Chaining Risky Mixture", "Midas's Risky Mixture", "Potent Risky Mixture")
	.setModifiers({ name: "Poison", stacks: 4 }, { name: "Regeneration", stacks: 4 })
	.setCooldown(1);
