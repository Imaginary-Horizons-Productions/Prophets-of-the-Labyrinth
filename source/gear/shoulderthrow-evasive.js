const { GearTemplate, Move } = require('../classes');
const { changeStagger, addModifier, getNames } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');

module.exports = new GearTemplate("Evasive Shoulder Throw",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and redirect a slower foe into targeting themself"],
		["Critical💥", "Gain @{mod0Stacks} extra @{mod0}"]
	],
	"Technique",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [evade] } = module.exports;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		const pendingEvade = { ...evade };
		if (isCrit) {
			pendingEvade.stacks++;
		}
		const resultLines = [];
		const targetMove = adventure.room.moves.find(move => {
			const moveUser = adventure.getCombatant(move.userReference);
			return moveUser.name === target.name && moveUser.title === target.title;
		});
		const userMove = adventure.room.moves.find(move => {
			const moveUser = adventure.getCombatant(move.userReference);
			return moveUser.name === user.name && moveUser.title === user.title;
		});
		const [targetName, userName] = getNames([target, user], adventure);
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: target.team, index: adventure.getCombatantIndex(target) }];
			resultLines.push(`${targetName} is redirected into targeting themself.`);
		}
		const addedEvade = addModifier([user], pendingEvade).length > 0;
		if (addedEvade) {
			resultLines.push(`${userName} gains ${getApplicationEmojiMarkdown("Evade")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Harmful Shoulder Throw", "Staggering Shoulder Throw")
	.setDurability(10)
	.setModifiers({ name: "Evade", stacks: 1 });
