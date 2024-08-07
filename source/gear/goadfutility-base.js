const { GearTemplate, Move } = require('../classes');
const { changeStagger, addModifier, getNames } = require('../util/combatantUtil');

module.exports = new GearTemplate("Goad Futility",
	"Gain @{mod0Stacks} @{mod0} and intercept the target's later single target move",
	"Inflict @{mod1Stacks} @{mod1} on the target",
	"Technique",
	"Earth",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [oblivious, unlucky] } = module.exports;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		addModifier([user], oblivious);
		const targetMove = adventure.room.moves.find(move => {
			const moveUser = adventure.getCombatant(move.userReference);
			return moveUser.name === target.name && moveUser.title === target.title;
		});
		const userMove = adventure.room.moves.find(move => {
			const moveUser = adventure.getCombatant(move.userReference);
			return moveUser.name === user.name && moveUser.title === user.title;
		});
		const [userName, targetName] = getNames([user, target], adventure);
		const sentences = [`${userName} gains Oblivious.`];
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			sentences.push(`${targetName} falls for the provocation.`);
		}
		if (isCrit) {
			const addedUnlucky = addModifier([target], unlucky).length > 0;
			if (addedUnlucky) {
				sentences.push(`${targetName} gains Unlucky.`);
			}
		}
		return sentences.join(" ");

		return ""; // see style guide for conventions on result texts
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "Oblivious", stacks: 1 }, { name: "Unlucky", stacks: 3 })
	.setDurability(10);
