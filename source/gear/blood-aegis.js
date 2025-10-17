const { GearTemplate, Move, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { payHP, changeStagger, addProtection, addModifier } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

//#region Base
const bloodAegis = new GearTemplate("Blood Aegis",
	[
		["use", "Gain <@{protection}> protection and intercept your target's later single target move"],
		["critical", "Protection x @{critBonus}"]
	],
	"Pact",
	"Darkness"
).setCost(200)
	.setEffect(bloodAegisEffect, { type: "single", team: "foe" })
	.setPactCost([5, "Pay (@{pactCost} x your level) HP"])
	.setScalings({
		protection: protectionScalingGenerator(125),
		critBonus: 2
	});

/** @type {typeof bloodAegis.effect} */
function bloodAegisEffect([target], user, adventure) {
	const { essence, pactCost, scalings: { protection, critBonus } } = bloodAegis;
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
	const results = [`Gaining protection, ${paymentSentence}`];
	const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
	const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
	if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
		targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
		results.push(`${target.name} falls for the provocation.`);
	}
	return results;
}
//#endregion Base

//#region Toxic
const toxicBloodAegis = new GearTemplate("Toxic Blood Aegis",
	[
		["use", "Gain <@{protection}> protection, intercept your target's later single target move and inflict @{mod0Stacks} @{mod0} on them"],
		["critical", "Protection x @{critBonus}"]
	],
	"Pact",
	"Darkness"
).setCost(350)
	.setEffect(toxicBloodAegisEffect, { type: "single", team: "foe" })
	.setPactCost([5, "Pay (@{pactCost} x your level) HP"])
	.setScalings({
		protection: protectionScalingGenerator(125),
		critBonus: 2
	})
	.setModifiers({ name: "Poison", stacks: 3 });

/** @type {typeof toxicBloodAegis.effect} */
function toxicBloodAegisEffect([target], user, adventure) {
	const { essence, pactCost, scalings: { protection, critBonus }, modifiers: [poison] } = toxicBloodAegis;
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
	return resultLines.concat(addModifier([target], poison));
}
//#endregion Toxic

//#region Urgent
const urgentBloodAegis = new GearTemplate("Urgent Blood Aegis",
	[
		["use", "Gain <@{protection}> protection and intercept your target's later single target move with priority"],
		["critical", "Protection x @{critBonus}"]
	],
	"Pact",
	"Darkness"
).setCost(350)
	.setEffect(bloodAegisEffect, { type: "single", team: "foe" })
	.setPactCost([5, "Pay (@{pactCost} x your level) HP"])
	.setScalings({
		protection: protectionScalingGenerator(125),
		critBonus: 2,
		priority: 1
	});
//#endregion Urgent

module.exports = new GearFamily(bloodAegis, [toxicBloodAegis, urgentBloodAegis], false);
