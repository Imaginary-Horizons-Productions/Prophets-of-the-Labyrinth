const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');

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
				return [`${target.name} gains ${getApplicationEmojiMarkdown("Regen")}.`];
			}
		} else {
			const addedPoison = addModifier([target], poison).length > 0;
			if (addedPoison) {
				return [`${target.name} gains ${getApplicationEmojiMarkdown("Poison")}.`];
			}
		}
		return [];
	}
).setTargetingTags({ type: "single", team: "any", needsLivingTargets: true })
	.setSidegrades("Potent Risky Mixture", "Midas's Risky Mixture")
	.setModifiers({ name: "Poison", stacks: 4 }, { name: "Regen", stacks: 4 })
	.setDurability(30);
