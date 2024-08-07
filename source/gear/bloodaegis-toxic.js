const { GearTemplate, Move } = require('../classes/index.js');
const { payHP, changeStagger, addProtection, getNames, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Toxic Blood Aegis",
	"Pay @{hpCost} hp; gain @{protection} protection, inflict @{mod0Stacks} @{mod0} on a foe and intercept their move",
	"Protection x@{critMultiplier}",
	"Pact",
	"Darkness",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [poison], protection, critMultiplier, hpCost } = module.exports;
		const paymentSentence = payHP(user, hpCost, adventure);
		if (adventure.lives < 1) {
			return paymentSentence;
		}
		const resultsSentences = [`Gaining protection, ${paymentSentence}`];
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([user], pendingProtection);
		const targetMove = adventure.room.moves.find(move => {
			const moveUser = adventure.getCombatant(move.userReference);
			return moveUser.name === target.name && moveUser.title === target.title;
		});
		const userMove = adventure.room.moves.find(move => {
			const moveUser = adventure.getCombatant(move.userReference);
			return moveUser.name === user.name && moveUser.title === user.title;
		});
		const addedPoison = addModifier([target], poison).length > 0;
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			resultsSentences.push(`${getNames([target], adventure)[0]} falls for the provocation${addedPoison ? ` and is Poisoned` : ""}.`);
		} else if (addedPoison) {
			resultsSentences.push(`${getNames([target], adventure)[0]} is Poisoned.`);
		}
		return resultsSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Charging Blood Aegis", "Reinforced Blood Aegis")
	.setDurability(15)
	.setModifiers({ name: "Poison", stacks: 3 })
	.setHPCost(25)
	.setProtection(125);
