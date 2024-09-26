const { GearTemplate, Move } = require('../classes/index.js');
const { payHP, changeStagger, addProtection, addModifier } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Toxic Blood Aegis",
	[
		["use", "Pay @{hpCost} HP; gain @{protection} protection, inflict @{mod0Stacks} @{mod0} on a foe and intercept their move"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Pact",
	"Darkness",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [poison], protection, critMultiplier, hpCost } = module.exports;
		const paymentSentence = payHP(user, hpCost, adventure);
		if (adventure.lives < 1) {
			return [paymentSentence];
		}
		const resultLines = [`Gaining protection, ${paymentSentence}`];
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
			resultLines.push(`${target.name} falls for the provocation${addedPoison ? ` and gains ${getApplicationEmojiMarkdown("Poison")}` : ""}.`);
		} else if (addedPoison) {
			resultLines.push(`${target.name} gains ${getApplicationEmojiMarkdown("Poison")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Charging Blood Aegis", "Reinforced Blood Aegis")
	.setDurability(15)
	.setModifiers({ name: "Poison", stacks: 3 })
	.setHPCost(25)
	.setProtection(125);
