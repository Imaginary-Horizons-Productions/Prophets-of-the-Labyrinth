const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');

module.exports = new GearTemplate("Midas's Risky Mixture",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} and @{mod2Stacks} @{mod2} on a target"],
		["Critical💥", "Apply @{mod1} instead of @{mod0}"]
	],
	"Trinket",
	"Darkness",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [poison, regen, curseOfMidas] } = module.exports;
		if (user.element === element) {
			if (target.team === user.team) {
				changeStagger([target], "elementMatchAlly");
			} else {
				changeStagger([target], "elementMatchFoe");
			}
		}
		const addedModifiers = [];
		if (isCrit) {
			const addedRegen = target.getModifierStacks("Oblivious") < 1;
			addModifier([target], regen);
			if (addedRegen) {
				addedModifiers.push(getApplicationEmojiMarkdown("Regen"));
			}
		} else {
			const addedPoison = target.getModifierStacks("Oblivious") < 1;
			addModifier([target], poison);
			if (addedPoison) {
				addedModifiers.push(getApplicationEmojiMarkdown("Poison"));
			}
		}
		const addedCurse = target.getModifierStacks("Oblivious") < 1;
		addModifier([target], curseOfMidas);
		if (addedCurse) {
			addedModifiers.push(getApplicationEmojiMarkdown("Curse of Midas"));
		}
		if (addedModifiers.length > 0) {
			return [`${target.name} gains ${addedModifiers.join("")}.`];
		} else {
			return [];
		}
	}
).setTargetingTags({ type: "single", team: "any", needsLivingTargets: true })
	.setSidegrades("Potent Risky Mixture", "Thick Risky Mixture")
	.setModifiers({ name: "Poison", stacks: 4 }, { name: "Regen", stacks: 4 }, { name: "Curse of Midas", stacks: 1 })
	.setDurability(15);
