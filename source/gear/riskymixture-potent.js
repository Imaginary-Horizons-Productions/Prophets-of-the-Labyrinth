const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_ALLY, ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Potent Risky Mixture",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a target"],
		["Critical💥", "Apply @{mod1} instead of @{mod0}"]
	],
	"Trinket",
	"Darkness",
	350,
	([target], user, adventure) => {
		const { element, modifiers: [poison, regen] } = module.exports;
		if (user.element === element) {
			if (target.team === user.team) {
				changeStagger([target], user, ELEMENT_MATCH_STAGGER_ALLY);
			} else {
				changeStagger([target], user, ELEMENT_MATCH_STAGGER_FOE);
			}
		}
		if (user.crit) {
			return generateModifierResultLines(addModifier([target], regen));
		} else {
			return generateModifierResultLines(addModifier([target], poison));
		}
	}
).setTargetingTags({ type: "single", team: "any" })
	.setSidegrades("Chaining Risky Mixture", "Midas's Risky Mixture")
	.setModifiers({ name: "Poison", stacks: 6 }, { name: "Regen", stacks: 6 })
	.setCooldown(1);
