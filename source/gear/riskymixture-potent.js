const { GearTemplate } = require('../classes');
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
				changeStagger([target], "elementMatchAlly");
			} else {
				changeStagger([target], "elementMatchFoe");
			}
		}
		if (user.crit) {
			return generateModifierResultLines(addModifier([target], regen));
		} else {
			return generateModifierResultLines(addModifier([target], poison));
		}
	}
).setTargetingTags({ type: "single", team: "any" })
	.setSidegrades("Midas's Risky Mixture", "Unbreakable Risky Mixture")
	.setModifiers({ name: "Poison", stacks: 6 }, { name: "Regen", stacks: 6 })
	.setDurability(15);
