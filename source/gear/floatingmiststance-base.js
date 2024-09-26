const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, enterStance } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new GearTemplate("Floating Mist Stance",
	[
		["use", "Enter a stance that increases Punch stagger by 2 and grants @{mod0Stacks} @{mod0} each round (exit other stances)"],
		["Critical💥", "Gain @{mod0Stacks} @{mod0} now"]
	],
	"Technique",
	"Light",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [displayEvade, floatingMistStance] } = module.exports;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		const { didAddStance, stancesRemoved } = enterStance(user, floatingMistStance);
		const addedModifiers = [];
		if (didAddStance) {
			addedModifiers.push(getApplicationEmojiMarkdown("Floating Mist Stance"));
		}
		if (isCrit) {
			const addedEvade = user.getModifierStacks("Oblivious") < 1;
			addModifier([user], displayEvade);
			if (addedEvade) {
				addedModifiers.push(getApplicationEmojiMarkdown("Evade"));
			}
		}

		const userEffects = [];
		if (addedModifiers.length > 0) {
			userEffects.push(`gains ${addedModifiers.join("")}`);
		}
		if (stancesRemoved.length > 0) {
			userEffects.push(`exits ${stancesRemoved.map(stance => getApplicationEmojiMarkdown(stance)).join("")}`);
		}
		return [`${user.name} ${listifyEN(userEffects, false)}.`];
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: false })
	.setUpgrades("Agile Floating Mist Stance", "Devoted Floating Mist Stance", "Soothing Floating Mist Stance")
	.setModifiers({ name: "Evade", stacks: 1 }, { name: "Floating Mist Stance", stacks: 1 })
	.setDurability(10)
	.setBonus(3) // Punch Stagger
	.setFlavorText({ name: "Floating Mist Stance", value: "Each stack increases Punch Stagger by @{bonus} and grants @{mod0Stacks} @{mod0} each round" });
