const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { payHP, changeStagger, addProtection, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Toxic Blood Aegis",
	[
		["use", "Gain <@{protection}> protection, intercept your target's later single target move and inflict @{mod0Stacks} @{mod0} on them"],
		["critical", "Protection x @{critBonus}"]
	],
	"Pact",
	"Darkness"
).setCost(350)
	.setEffect(([target], user, adventure) => {
		const { essence, pactCost, scalings: { protection, critBonus }, modifiers: [poison] } = module.exports;
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
		return resultLines.concat(generateModifierResultLines(addModifier([target], poison)));
	}, { type: "single", team: "foe" })
	.setSidegrades("Urgent Blood Aegis")
	.setPactCost([5, "Pay (@{pactCost} x your level) HP"])
	.setScalings({
		protection: protectionScalingGenerator(125),
		critBonus: 2
	})
	.setModifiers({ name: "Poison", stacks: 3 });
