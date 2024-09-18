const { GearTemplate, Move } = require('../classes');
const { changeStagger, addModifier, getNames } = require('../util/combatantUtil');

module.exports = new GearTemplate("Evasive Heat Mirage",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and intercept the target's later single target move"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Spell",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [evade], critMultiplier } = module.exports;
		const pendingEvade = { ...evade };
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (isCrit) {
			pendingEvade.stacks *= critMultiplier;
		}
		const resultSentences = [];
		const [userName, targetName] = getNames([user, target], adventure);
		const addedEvade = addModifier([user], pendingEvade).length > 0;
		if (addedEvade) {
			resultSentences.push(`${userName} prepares to Evade.`);
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
			resultSentences.push(`${targetName} falls for the provocation.`);
		}
		if (resultSentences.length > 0) {
			return resultSentences.join(" ");
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Unlucky Heat Mirage", "Vigilant Heat Mirage")
	.setModifiers({ name: "Evade", stacks: 3 })
	.setDurability(10);
