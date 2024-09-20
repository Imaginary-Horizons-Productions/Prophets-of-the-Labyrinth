const { GearTemplate, Move } = require('../classes');
const { changeStagger, addModifier, getNames, dealDamage } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');

module.exports = new GearTemplate("Harmful Shoulder Throw",
	[
		["use", "Strike a foe for @{damage} @{element} damage then redirect them into targeting themself if they're slower"],
		["Critical💥", "Gain @{mod0Stacks} @{mod0}"]
	],
	"Technique",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [evade], damage } = module.exports;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		const resultLines = dealDamage([target], user, damage, false, element, adventure);
		if (target.hp > 0) {
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
				resultLines.push(`${getNames([target], adventure)[0]} is redirected into targeting themself.`);
			}
		}
		if (isCrit) {
			const addedEvade = addModifier([user], evade).length > 0;
			if (addedEvade) {
				resultLines.push(`${getNames([user], adventure)[0]} gains ${getApplicationEmojiMarkdown("Evade")}.`);
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Evasive Shoulder Throw", "Staggering Shoulder Throw")
	.setDurability(10)
	.setModifiers({ name: "Evade", stacks: 1 })
	.setDamage(15);
