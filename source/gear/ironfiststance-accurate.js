const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, enterStance, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");
const { accuratePassive } = require("./descriptions/passives");

module.exports = new GearTemplate("Accurate Iron Fist Stance",
	[
		accuratePassive,
		["use", "Gain @{mod0Stacks} @{mod0} (exit other stances)"],
		["Critical💥", "Inflict @{mod1Stacks} @{mod1} on all enemies"]
	],
	"Technique",
	"Light",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [ironFistStance, frail] } = module.exports;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		const receipts = enterStance(user, ironFistStance);
		if (user.crit) {
			const foeTeam = user.team === "delver" ? adventure.room.enemies.filter(foe => foe.hp > 0) : adventure.delvers;
			receipts.push(...addModifier(foeTeam, frail));
		}

		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Lucky Iron Fist Stance", "Organic Iron Fist Stance")
	.setModifiers({ name: "Iron Fist Stance", stacks: 1 }, { name: "Frail", stacks: 4 })
	.setBonus(45) // Punch damage boost
	.setDurability(10)
	.setCritRate(5)
	.setFlavorText({ name: "Iron Fist Stance", value: "Changes Punch's element to the bearer's and increases its damage by @{bonus} per stack" });
