const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

//#region Base
const vacuumImplosion = new GearTemplate("Vacuum Implosion",
	[
		["use", "Deal <@{damage} (+ @{duelistsBonus} if only attacker)> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Spell",
	"Wind"
).setCost(200)
	.setEffect(vacuumImplosionEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		duelistsBonus: 75,
		critBonus: 2
	});

/** @type {typeof vacuumImplosion.effect} */
function vacuumImplosionEffect([target], user, adventure) {
	const { essence, scalings: { damage, duelistsBonus, critBonus } } = vacuumImplosion;
	let pendingDamage = damage.calculate(user);
	// Duelist's check
	const userIndex = adventure.getCombatantIndex(user);
	const targetIndex = adventure.getCombatant(target);
	if (adventure.room.moves.every(move => (move.userReference.team === user.team && move.userReference.index === userIndex) && (move.userReference.team !== user.team) && move.targets.every(moveTarget => moveTarget.team !== target.team || moveTarget.index !== targetIndex))) {
		pendingDamage += duelistsBonus;
	}
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage([target], user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return results;
}
//#endregion Base

//#region Shattering
const shatteringVacuumImplosion = new GearTemplate("Shattering Vacuum Implosion",
	[
		["use", "Inflict <@{damage} (+ @{duelistsBonus} if only attacker)> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Spell",
	"Wind"
).setCost(350)
	.setEffect(shatteringVacuumImplosionEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		duelistsBonus: 75,
		critBonus: 2
	})
	.setModifiers({ name: "Frailty", stacks: 3 });

/** @type {typeof shatteringVacuumImplosion.effect} */
function shatteringVacuumImplosionEffect([target], user, adventure) {
	const { essence, scalings: { damage, duelistsBonus, critBonus }, modifiers: [frailty] } = shatteringVacuumImplosion;
	let pendingDamage = damage.calculate(user);
	// Duelist's check
	const userIndex = adventure.getCombatantIndex(user);
	const targetIndex = adventure.getCombatant(target);
	if (adventure.room.moves.every(move => (move.userReference.team === user.team && move.userReference.index === userIndex) && (move.userReference.team !== user.team) && move.targets.every(moveTarget => moveTarget.team !== target.team || moveTarget.index !== targetIndex))) {
		pendingDamage += duelistsBonus;
	}
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage([target], user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return results.concat(addModifier([target], frailty));
}
//#endregion Shattering

//#region Urgent
const urgentVacuumImplosion = new GearTemplate("Urgent Vacuum Implosion",
	[
		["use", "Deal <@{damage} (+ @{duelistsBonus} if only attacker)> @{essence} damage to a foe with priority"],
		["critical", "Damage x @{critBonus}"]
	],
	"Spell",
	"Wind"
).setCost(350)
	.setEffect(vacuumImplosionEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		duelistsBonus: 75,
		critBonus: 2,
		priority: 1
	});
//#endregion Urgent

module.exports = new GearFamily(vacuumImplosion, [shatteringVacuumImplosion, urgentVacuumImplosion], false);
