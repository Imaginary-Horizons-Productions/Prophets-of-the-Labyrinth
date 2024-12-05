const { GearTemplate } = require("../classes");
const { ELEMENT_MATCH_STAGGER_ALLY } = require("../constants");
const { addModifier, changeStagger, enterStance, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");

module.exports = new GearTemplate("Iron Fist Stance",
	[
		["use", "Increase Punch damage by @{bonus} and change its type to yours (exit other stances)"],
		["Critical💥", "Inflict @{mod1Stacks} @{mod1} on all enemies"]
	],
	"Technique",
	"Light",
	200,
	(targets, user, adventure) => {
		const { element, modifiers: [ironFistStance, frail] } = module.exports;
		if (user.element === element) {
			changeStagger([user], user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		const receipts = enterStance(user, ironFistStance);
		if (user.crit) {
			const foeTeam = user.team === "delver" ? adventure.room.enemies.filter(foe => foe.hp > 0) : adventure.delvers;
			receipts.push(...addModifier(foeTeam, frail));
		}

		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setUpgrades("Accurate Iron Fist Stance", "Chaining Iron Fist Stance", "Lucky Iron Fist Stance")
	.setModifiers({ name: "Iron Fist Stance", stacks: 1 }, { name: "Frail", stacks: 4 })
	.setBonus(45) // Punch damage boost
	.setCooldown(2)
	.setFlavorText({ name: "Iron Fist Stance", value: "Changes Punch's element to the bearer's and increases its damage by @{bonus} per stack" });
