const { GearTemplate, Move } = require('../classes');
const { changeStagger, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Vigilant Heat Mirage",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}, then intercept the target's later single target move"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Spell",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [evade, vigilance], critMultiplier } = module.exports;
		const pendingEvade = { ...evade };
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (isCrit) {
			pendingEvade.stacks *= critMultiplier;
		}
		const receipts = addModifier([user], pendingEvade).concat(addModifier([user], vigilance));
		const resultLines = generateModifierResultLines(combineModifierReceipts(receipts));
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
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Evasive Heat Mirage", "Unlucky Heat Mirage")
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Vigilance", stacks: 1 })
	.setDurability(10);