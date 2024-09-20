const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, getNames, enterStance } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new GearTemplate("Agile Floating Mist Stance",
	[
		["use", "Gain @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2} (exit other stances)"],
		["Critical💥", "Gain @{mod0Stacks} @{mod0}"]
	],
	"Technique",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [displayEvade, floatingMistStance, agility] } = module.exports;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		const { didAddStance, stancesRemoved } = enterStance(user, floatingMistStance);
		const addedModifiers = [];
		if (didAddStance) {
			addedModifiers.push(getApplicationEmojiMarkdown("Floating Mist Stance"));
		}
		const addedAgility = addModifier([user], agility).length > 0;
		if (addedAgility) {
			addedModifiers.push(getApplicationEmojiMarkdown("Agility"));
		}
		if (isCrit) {
			const addedEvade = addModifier([user], displayEvade).length > 0;
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
		return [`${getNames([user], adventure)[0]} ${listifyEN(userEffects, false)}.`];
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: false })
	.setSidegrades("Devoted Floating Mist Stance", "Soothing Floating Mist Stance")
	.setModifiers({ name: "Evade", stacks: 1 }, { name: "Floating Mist Stance", stacks: 1 }, { name: "Agility", stacks: 2 })
	.setDurability(10)
	.setBonus(3) // Punch Stagger
	.setFlavorText({ name: "Floating Mist Stance", value: "Each stack increases Punch Stagger by @{bonus} and grants @{mod0Stacks} @{mod0} each round" });
