const { GearTemplate } = require("../classes");
const { ELEMENT_MATCH_STAGGER_ALLY } = require("../constants");
const { addModifier, changeStagger, enterStance, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");

module.exports = new GearTemplate("Floating Mist Stance",
	[
		["use", "Enter a stance that increases Punch stagger by 2 and grants @{mod0Stacks} @{mod0} each round (exit other stances)"],
		["Critical💥", "Gain @{mod0Stacks} @{mod0} now"]
	],
	"Technique",
	"Light",
	200,
	(targets, user, adventure) => {
		const { element, modifiers: [displayEvade, floatingMistStance] } = module.exports;
		if (user.element === element) {
			changeStagger([user], user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		const receipts = enterStance(user, floatingMistStance);
		if (user.crit) {
			receipts.push(...addModifier([user], displayEvade));
		}
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setUpgrades("Agile Floating Mist Stance", "Devoted Floating Mist Stance", "Soothing Floating Mist Stance")
	.setModifiers({ name: "Evade", stacks: 1 }, { name: "Floating Mist Stance", stacks: 1 })
	.setCooldown(2)
	.setBonus(3) // Punch Stagger
	.setFlavorText({ name: "Floating Mist Stance", value: "Each stack increases Punch Stagger by @{bonus} and grants @{mod0Stacks} @{mod0} each round" });
