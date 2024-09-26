const { GearTemplate, Move } = require('../classes');
const { changeStagger, addModifier } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');

module.exports = new GearTemplate("Heat Mirage",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and intercept the target's later single target move"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Spell",
	"Fire",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [evade], critMultiplier } = module.exports;
		const pendingEvade = { ...evade };
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (isCrit) {
			pendingEvade.stacks *= critMultiplier;
		}
		const resultLines = [];
		const addedEvade = addModifier([user], pendingEvade).length > 0;
		if (addedEvade) {
			resultLines.push(`${user.name} gains ${getApplicationEmojiMarkdown("Evade")}.`);
		}
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
	.setUpgrades("Evasive Heat Mirage", "Unlucky Heat Mirage", "Vigilant Heat Mirage")
	.setModifiers({ name: "Evade", stacks: 2 })
	.setDurability(10);
