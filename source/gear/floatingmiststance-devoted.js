const { GearTemplate } = require("../classes");
const { ELEMENT_MATCH_STAGGER_ALLY } = require("../constants");
const { addModifier, changeStagger, enterStance, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");

module.exports = new GearTemplate("Devoted Floating Mist Stance",
	[
		["use", "Give an ally @{mod1Stacks} @{mod1} (exit other stances)"],
		["Critical💥", "Also give @{mod0Stacks} @{mod0}"]
	],
	"Technique",
	"Light",
	350,
	([target], user, adventure) => {
		const { element, modifiers: [displayEvade, floatingMistStance] } = module.exports;
		if (user.element === element) {
			changeStagger([target], user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		const receipts = enterStance(target, floatingMistStance);
		if (user.crit) {
			receipts.push(...addModifier([target], displayEvade));
		}
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Agile Floating Mist Stance", "Soothing Floating Mist Stance")
	.setModifiers({ name: "Evade", stacks: 1 }, { name: "Floating Mist Stance", stacks: 1 })
	.setCooldown(2)
	.setBonus(3) // Punch Stagger
	.setFlavorText({ name: "Floating Mist Stance", value: "Each stack increases Punch Stagger by @{bonus} and grants @{mod0Stacks} @{mod0} each round" });
