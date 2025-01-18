const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { payHP, changeStagger, addProtection } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Urgent Blood Aegis",
	[
		["use", "Gain <@{protection}> protection and intercept your target's later single target move with priority"],
		["Critical💥", "Protection x @{critBonus}"]
	],
	"Pact",
	"Darkness"
).setCost(350)
	.setEffect(([target], user, adventure) => {
		const { essence, pactCost, scalings: { protection, critBonus } } = module.exports;
		const paymentSentence = payHP(user, user.level * pactCost[0], adventure);
		if (adventure.lives < 1) {
			return [paymentSentence];
		}
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingProtection = protection.calculate(user);
		if (user.crit) {
			pendingProtection *= critBonus;
		}
		addProtection([user], pendingProtection);
		const resultLines = [`Gaining protection, ${paymentSentence}`];
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			resultLines.push(`${target.name} falls for the provocation.`);
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setSidegrades("Toxic Blood Aegis")
	.setPactCost([5, "Pay (@{pactCost} x your level) HP"])
	.setScalings({
		protection: protectionScalingGenerator(125),
		critBonus: 2,
		priority: 1
	});
