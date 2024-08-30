const { GearTemplate, Move } = require('../classes');
const { changeStagger, addModifier, getNames } = require('../util/combatantUtil');

module.exports = new GearTemplate("Evasive Shoulder Throw",
	"Gain @{mod0Stacks} @{mod0} and redirect a slower foe into targeting themself",
	"Gain @{mod0Stacks} extra @{mod0}",
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
		const addedEvade = addModifier([user], pendingEvade).length > 0;
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
			const [targetName, userName] = getNames([target, user], adventure);
			if (addedEvade) {
				return `${targetName} is redirected into targeting themself. ${userName} prepares to Evade.`;
			} else {
				return `${targetName} is redirected into targeting themself.`;
			}
		} else if (addedEvade) {
			return `${getNames([user], adventure)[0]} prepares to Evade.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Staggering Shoulder Throw")
	.setDurability(10)
	.setModifiers({ name: "Evade", stacks: 1 });
