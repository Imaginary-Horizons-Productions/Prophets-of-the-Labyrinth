const { GearTemplate, Move } = require('../classes');
const { changeStagger, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Staggering Shoulder Throw",
	[
		["use", "Redirect a slower foe into targeting themself"],
		["Critical💥", "Gain @{mod0Stacks} @{mod0}"]
	],
	"Technique",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [evade] } = module.exports;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		const resultLines = [`${target.name} is Staggered.`];
		const targetMove = adventure.room.moves.find(move => {
			const moveUser = adventure.getCombatant(move.userReference);
			return moveUser.name === target.name && moveUser.title === target.title;
		});
		const userMove = adventure.room.moves.find(move => {
			const moveUser = adventure.getCombatant(move.userReference);
			return moveUser.name === user.name && moveUser.title === user.title;
		});
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: target.team, index: adventure.getCombatantIndex(target) }];
			resultLines.push(`${target.name} is redirected into targeting themself.`);
		}
		if (isCrit) {
			resultLines.push(...addModifier([user], evade));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Evasive Shoulder Throw", "Harmful Shoulder Throw")
	.setDurability(10)
	.setModifiers({ name: "Evade", stacks: 1 })
	.setStagger(2);
