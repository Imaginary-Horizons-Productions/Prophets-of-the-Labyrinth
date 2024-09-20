const { GearTemplate, Move } = require('../classes');
const { changeStagger, addModifier, getNames } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');

module.exports = new GearTemplate("Shoulder Throw",
	[
		["use", "Redirect a slower foe into targeting themself"],
		["Critical💥", "Gain @{mod0Stacks} @{mod0}"]
	],
	"Technique",
	"Light",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [evade] } = module.exports;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
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
		if (isCrit) {
			const addedEvade = addModifier([user], evade).length > 0;
			if (addedEvade) {
				resultLines.push(`${userName} gains ${getApplicationEmojiMarkdown("Evade")}.`);
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Evasive Shoulder Throw", "Harmful Shoulder Throw", "Staggering Shoulder Throw")
	.setDurability(10)
	.setModifiers({ name: "Evade", stacks: 1 });
