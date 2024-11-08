const { GearTemplate, Move } = require('../classes');
const { changeStagger, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Shattering Goad Futility",
	[
		["use", "Gain @{mod0Stacks} @{mod0}, intercept the target's later single target move, and inflict @{mod2Stacks} @{mod2} on them"],
		["Critical💥", "Inflict @{mod1Stacks} @{mod1} on the target"]
	],
	"Technique",
	"Earth",
	350,
	([target], user, adventure) => {
		const { element, modifiers: [oblivious, unlucky, frail] } = module.exports;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		const resultLines = [];
		const receipts = addModifier([user], oblivious);
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			resultLines.push(`${target.name} falls for the provocation.`);
		}
		receipts.push(...addModifier([target], frail));
		if (user.crit) {
			receipts.push(...addModifier([target], unlucky));
		}
		return generateModifierResultLines(combineModifierReceipts(receipts)).concat(resultLines);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Flanking Goad Futility", "Poised Goad Futility")
	.setModifiers({ name: "Oblivious", stacks: 1 }, { name: "Unlucky", stacks: 3 }, { name: "Frail", stacks: 4 })
	.setDurability(10);
