const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil');

module.exports = new GearTemplate("Thick Risky Mixture",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a target"],
		["Critical💥", "Apply @{mod1} instead of @{mod0}"]
	],
	"Trinket",
	"Darkness",
	350,
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
			const addedRegen = addModifier([target], regen).length > 0;
			if (addedRegen) {
				return `${getNames([target], adventure)[0]} gains Regen.`;
			} else {
				return "But nothing happened.";
			}
		} else {
			const addedPoison = addModifier([target], poison).length > 0;
			if (addedPoison) {
				return `${getNames([target], adventure)[0]} was Poisoned.`;
			} else {
				return "But nothing happened.";
			}
		}
	}
).setTargetingTags({ type: "single", team: "any", needsLivingTargets: true })
	.setSidegrades("Potent Risky Mixture", "Midas's Risky Mixture")
	.setModifiers({ name: "Poison", stacks: 4 }, { name: "Regen", stacks: 4 })
	.setDurability(30);
