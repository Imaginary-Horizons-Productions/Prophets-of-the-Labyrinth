const { GearTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_ALLY } = require("../constants");
const { addModifier, changeStagger, enterStance, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");

module.exports = new GearTemplate("Chaining Iron Fist Stance",
	[
		["use", "Gain @{mod0Stacks} @{mod0} (exit other stances)"],
		["Critical💥", "Inflict @{mod1Stacks} @{mod1} on all enemies"]
	],
	"Technique",
	"Light",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [ironFistStance, frail] } = module.exports;
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const receipts = enterStance(user, ironFistStance);
		if (user.crit) {
			const foeTeam = user.team === "delver" ? adventure.room.enemies.filter(foe => foe.hp > 0) : adventure.delvers;
			receipts.push(...addModifier(foeTeam, frail));
		}

		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Organic Iron Fist Stance", "Lucky Iron Fist Stance")
	.setModifiers({ name: "Iron Fist Stance", stacks: 1 }, { name: "Frail", stacks: 4 })
	.setBonus(45) // Punch damage boost
	.setCooldown(1)
	.setFlavorText({ name: "Iron Fist Stance", value: "Changes Punch's essence to the bearer's and increases its damage by @{bonus} per stack" });
