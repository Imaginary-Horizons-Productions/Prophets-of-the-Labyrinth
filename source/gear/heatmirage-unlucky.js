const { GearTemplate, Move } = require('../classes');
const { changeStagger, addModifier, getNames } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Unlucky Heat Mirage",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and inflict @{mod1Stacks} @{mod1} on a foe and intercept their later single target move"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Spell",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [evade, unlucky], critMultiplier } = module.exports;
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
		const targetEffects = [];
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
			target.push("falls for the provocation");
		}
		const addedUnlucky = addModifier([target], unlucky).length > 0;
		if (addedUnlucky) {
			targetEffects.push("gains Unlucky");
		}
		if (targetEffects.length > 0) {
			resultSentences.push(`${targetName} ${listifyEN(targetEffects)}.`);
		}
		if (resultSentences.length > 0) {
			return resultSentences.join(" ");
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Evasive Heat Mirage", "Vigilant Heat Mirage")
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Unlucky", stacks: 2 })
	.setDurability(10);
