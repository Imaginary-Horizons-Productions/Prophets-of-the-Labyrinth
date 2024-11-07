const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, enterStance, combineModifierReceipts, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new GearTemplate("Agile Floating Mist Stance",
	[
		["use", "Gain @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2} (exit other stances)"],
		["Critical💥", "Gain @{mod0Stacks} @{mod0}"]
	],
	"Technique",
	"Light",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [displayEvade, floatingMistStance, agility] } = module.exports;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		const receipts = enterStance(user, floatingMistStance).concat(addModifier([user], agility));
		if (user.crit) {
			receipts.push(...addModifier([user], displayEvade));
		}
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Devoted Floating Mist Stance", "Soothing Floating Mist Stance")
	.setModifiers({ name: "Evade", stacks: 1 }, { name: "Floating Mist Stance", stacks: 1 }, { name: "Agility", stacks: 2 })
	.setDurability(10)
	.setBonus(3) // Punch Stagger
	.setFlavorText({ name: "Floating Mist Stance", value: "Each stack increases Punch Stagger by @{bonus} and grants @{mod0Stacks} @{mod0} each round" });
