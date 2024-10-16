const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Risky Mixture",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a target"],
		["Critical💥", "Apply @{mod1} instead of @{mod0}"]
	],
	"Trinket",
	"Darkness",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [poison, regen] } = module.exports;
		if (user.element === element) {
			if (target.team === user.team) {
				changeStagger([target], "elementMatchAlly");
			} else {
				changeStagger([target], "elementMatchFoe");
			}
		}
		if (isCrit) {
			return generateModifierResultLines(addModifier([target], regen));
		} else {
			return generateModifierResultLines(addModifier([target], poison));
		}
	}
).setTargetingTags({ type: "single", team: "any", needsLivingTargets: true })
	.setUpgrades("Midas's Risky Mixture", "Potent Risky Mixture", "Thick Risky Mixture")
	.setModifiers({ name: "Poison", stacks: 4 }, { name: "Regen", stacks: 4 })
	.setDurability(15);
