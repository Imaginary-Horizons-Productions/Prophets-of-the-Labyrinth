const { GearTemplate, Move } = require('../classes');
const { changeStagger, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Flanking Goad Futility",
	[
		["use", "Gain @{mod0Stacks} @{mod0}, intercept the target's later single target move, and inflict @{mod2Stacks} @{mod2} on them"],
		["Critical💥", "Inflict @{mod1Stacks} @{mod1} on the target"]
	],
	"Technique",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [oblivious, unlucky, exposed] } = module.exports;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		const resultLines = [];
		const receipts = addModifier([user], oblivious);
		const targetMove = adventure.room.moves.find(move => {
			const moveUser = adventure.getCombatant(move.userReference);
			return moveUser.name === target.name && moveUser.title === target.title;
		});
		const userMove = adventure.room.moves.find(move => {
			const moveUser = adventure.getCombatant(move.userReference);
			return moveUser.name === user.name && moveUser.title === user.title;
		});
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			resultLines.push(`${target.name} falls for the provocation.`);
		}
		receipts.push(...addModifier([target], exposed));
		if (isCrit) {
			receipts.push(...addModifier([target], unlucky));
		}
		return generateModifierResultLines(combineModifierReceipts(receipts)).concat(resultLines);
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Poised Goad Futility", "Shattering Goad Futility")
	.setModifiers({ name: "Oblivious", stacks: 1 }, { name: "Unlucky", stacks: 3 }, { name: "Exposed", stacks: 2 })
	.setDurability(10);
