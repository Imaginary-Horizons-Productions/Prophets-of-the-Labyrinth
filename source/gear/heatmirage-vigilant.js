const { GearTemplate, Move } = require('../classes');
const { changeStagger, addModifier, getNames } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

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
		const resultSentences = [];
		const [userName, targetName] = getNames([user, target], adventure);
		const userResults = [];
		const addedEvade = addModifier([user], pendingEvade).length > 0;
		if (addedEvade) {
			userResults.push("prepares to Evade");
		}
		const addedVigilance = addModifier([user], vigilance).length > 0;
		if (addedVigilance) {
			userResults.push("gains Vigilance");
		}
		if (userResults.length > 0) {
			resultSentences.push(`${userName} ${listifyEN(userResults)}.`);
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
	.setSidegrades("Evasive Heat Mirage", "Unlucky Heat Mirage")
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Vigilance", stacks: 1 })
	.setDurability(10);
