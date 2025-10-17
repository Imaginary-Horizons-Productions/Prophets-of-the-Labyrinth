const { GearTemplate, Move, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

//#region Base
const vengefulVoid = new GearTemplate("Vengeful Void",
	[
		["use", "Deal <@{damage} (+ @{reactiveBonus} if after the foe)> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Spell",
	"Darkness"
).setCost(200)
	.setEffect(vengefulVoidEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		reactiveBonus: 75,
		critBonus: 2
	});

/** @type {typeof vengefulVoid.effect} */
function vengefulVoidEffect(targets, user, adventure) {
	const { essence, scalings: { damage, reactiveBonus, critBonus } } = module.exports;
	let pendingDamage = damage.calculate(user);
	const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
	const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(targets[0]), team: targets[0].team });

	if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
		pendingDamage += reactiveBonus;
	}
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return results;
}
//#endregion Base

//#region Hexing
const hexingVengefulVoid = new GearTemplate("Hexing Vengeful Void",
	[
		["use", "Inflict <@{damage} (+ @{reactiveBonus} if after the foe)> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Spell",
	"Darkness"
).setCost(350)
	.setEffect(hexingVengefulVoidEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		reactiveBonus: 75,
		critBonus: 2
	})
	.setModifiers({ name: "Misfortune", stacks: 8 });

/** @type {typeof hexingVengefulVoid.effect} */
function hexingVengefulVoidEffect(targets, user, adventure) {
	const { essence, scalings: { damage, reactiveBonus, critBonus }, modifiers: [misfortune] } = hexingVengefulVoid;
	let pendingDamage = damage.calculate(user);
	const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
	const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(targets[0]), team: targets[0].team });

	if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
		pendingDamage += reactiveBonus;
	}
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (survivors.length > 0) {
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		results.push(...addModifier(survivors, misfortune));
	}
	return results;
}
//#endregion Hexing

//#region Numbing
const numbingVengefulVoid = new GearTemplate("Numbing Vengeful Void",
	[
		["use", "Inflict <@{damage} (+ @{reactiveBonus} if after the foe)> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Spell",
	"Darkness"
).setCost(350)
	.setEffect(numbingVengefulVoidEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		reactiveBonus: 75,
		critBonus: 2
	})
	.setModifiers({ name: "Clumsiness", stacks: 1 });

/** @type {typeof numbingVengefulVoid.effect} */
function numbingVengefulVoidEffect(targets, user, adventure) {
	const { essence, scalings: { damage, reactiveBonus, critBonus }, modifiers: [clumsiness] } = module.exports;
	let pendingDamage = damage.calculate(user);
	const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
	const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(targets[0]), team: targets[0].team });

	if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
		pendingDamage += reactiveBonus;
	}
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (survivors.length > 0) {
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		results.push(...addModifier(survivors, clumsiness));
	}
	return results;
}
//#endregion Numbing

module.exports = new GearFamily(vengefulVoid, [hexingVengefulVoid, numbingVengefulVoid], false);
