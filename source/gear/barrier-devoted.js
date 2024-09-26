const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Devoted Barrier",
	[
		["use", "Grant an ally @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod1} x@{critMultiplier}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [evade, vigilance], critMultiplier } = module.exports;
		const pendingVigilance = { ...vigilance };
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (isCrit) {
			pendingVigilance.stacks *= critMultiplier;
		}
		const addedModifiers = [];
		const addedVigilance = targets[0].getModifierStacks("Oblivious") < 1;
		addModifier(targets, vigilance);
		if (addedVigilance) {
			addedModifiers.push(getApplicationEmojiMarkdown("Vigilance"));
		}
		const addedEvade = targets[0].getModifierStacks("Oblivious") < 1;
		addModifier(targets, evade);
		if (addedEvade) {
			addedModifiers.push(getApplicationEmojiMarkdown("Evade"));
		}
		if (addedModifiers.length > 0) {
			return [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", `${addedModifiers.join("")}.`)];
		} else {
			return [];
		}
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Cleansing Barrier", "Vigilant Barrier")
	.setModifiers({ name: "Evade", stacks: 3 }, { name: "Vigilance", stacks: 1 })
	.setDurability(5);
