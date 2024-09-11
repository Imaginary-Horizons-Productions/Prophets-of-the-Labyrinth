const { GearTemplate, Move } = require('../classes');
const { payHP, changeStagger, addProtection, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Blood Aegis",
	[
		["use", "Pay @{hpCost} hp; gain @{protection} protection and intercept a later single target move"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Pact",
	"Darkness",
	200,
	([target], user, isCrit, adventure) => {
		const { element, protection, critMultiplier, hpCost } = module.exports;
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
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			resultsSentences.push(`${getNames([target], adventure)[0]} falls for the provocation.`);
		}
		return resultsSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Charging Blood Aegis", "Reinforced Blood Aegis", "Toxic Blood Aegis")
	.setDurability(15)
	.setHPCost(25)
	.setProtection(125);
