const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Barrier",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod1} x@{critMultiplier}"]
	],
	"Spell",
	"Wind",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [evade, vigilance], critMultiplier } = module.exports;
		const pendingVigilance = { ...vigilance };
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingVigilance.stacks *= critMultiplier;
		}
		const addedModifiers = [];
		const addedVigilance = user.getModifierStacks("Oblivious") < 1;
		addModifier([user], pendingVigilance);
		if (addedVigilance) {
			addedModifiers.push(getApplicationEmojiMarkdown("Vigilance"));
		}
		const addedEvade = user.getModifierStacks("Oblivious") < 1;
		addModifier([user], evade);
		if (addedEvade) {
			addedModifiers.push(getApplicationEmojiMarkdown("Evade"));
		}
		if (addedModifiers.length > 0) {
			return [`${user.name} gains ${addedModifiers.join("")}.`];
		} else {
			return [];
		}
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: false })
	.setUpgrades("Cleansing Barrier", "Devoted Barrier", "Vigilant Barrier")
	.setModifiers({ name: "Evade", stacks: 3 }, { name: "Vigilance", stacks: 1 })
	.setDurability(5);
