const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, enterStance } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new GearTemplate("Devoted Floating Mist Stance",
	[
		["use", "Give an ally @{mod1Stacks} @{mod1} (exit other stances)"],
		["Critical💥", "Also give @{mod0Stacks} @{mod0}"]
	],
	"Technique",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [displayEvade, floatingMistStance] } = module.exports;
		if (user.element === element) {
			changeStagger([target], "elementMatchAlly");
		}
		const { didAddStance, stancesRemoved } = enterStance(target, floatingMistStance);
		const addedModifiers = [];
		if (didAddStance) {
			addedModifiers.push(getApplicationEmojiMarkdown("Floating Mist Stance"));
		}
		if (isCrit) {
			const addedEvade = target.getModifierStacks("Oblivious") < 1;
			addModifier([target], displayEvade);
			if (addedEvade) {
				addedModifiers.push(getApplicationEmojiMarkdown("Evade"));
			}
		}

		const targetEffects = [];
		if (addedModifiers.length > 0) {
			targetEffects.push(`gains ${addedModifiers.join("")}`);
		}
		if (stancesRemoved.length > 0) {
			targetEffects.push(`exits ${stancesRemoved.map(stance => getApplicationEmojiMarkdown(stance)).join("")}`);
		}
		return [`${target.name} ${listifyEN(targetEffects, false)}.`];
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: false })
	.setSidegrades("Agile Floating Mist Stance", "Soothing Floating Mist Stance")
	.setModifiers({ name: "Evade", stacks: 1 }, { name: "Floating Mist Stance", stacks: 1 })
	.setDurability(10)
	.setBonus(3) // Punch Stagger
	.setFlavorText({ name: "Floating Mist Stance", value: "Each stack increases Punch Stagger by @{bonus} and grants @{mod0Stacks} @{mod0} each round" });
