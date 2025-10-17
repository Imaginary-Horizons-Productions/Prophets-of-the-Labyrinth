const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, dealDamage, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

//#region Base
const flail = new GearTemplate("Flail",
	[
		["use", "Inflict <@{damage}> @{essence} damage on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Earth"
).setCost(200)
	.setEffect(flailEffect, { type: "single", team: "foe" })
	.setUpgrades("Bouncing Flail", "Incompatible Flail")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setStagger(2);

/** @type {typeof flail.effect} */
function flailEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, stagger } = flail;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	let pendingStagger = stagger;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
	}
	if (survivors.length > 0) {
		results.push(changeStagger(survivors, user, pendingStagger));
	}
	return results;
}
//#endregion Base

//#region Bouncing
const bounces = 3;
const bouncingFlail = new GearTemplate("Bouncing Flail",
	[
		["use", "Inflict <@{damage}> @{essence} damage on @{bounces} random foes"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Earth"
).setCost(350)
	.setEffect(bouncingFlailEffect, { type: `random${SAFE_DELIMITER}${bounces}`, team: "foe" })
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(20),
		critBonus: 2,
		bounces
	})
	.setRnConfig({ foes: bounces })
	.setStagger(2);

/** @type {typeof bouncingFlail.effect} */
function bouncingFlailEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, stagger } = bouncingFlail;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	let pendingStagger = stagger;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
	}
	if (survivors.length > 0) {
		results.push(changeStagger(survivors, user, pendingStagger));
	}
	return results;
}
//#endregion Bouncing

//#region Incompatible
const incompatibleFlail = new GearTemplate("Incompatible Flail",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Earth"
).setCost(350)
	.setEffect(incompatibleFlailEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setStagger(2)
	.setModifiers({ name: "Incompatibility", stacks: 2 });

/** @type {typeof incompatibleFlail.effect} */
function incompatibleFlailEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, stagger, modifiers: [torpidity] } = incompatibleFlail;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	let pendingStagger = stagger;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
	}
	if (survivors.length > 0) {
		results.push(changeStagger(survivors, user, pendingStagger));
	}
	return results.concat(addModifier(survivors, torpidity));
}
//#endregion Incompatible

module.exports = new GearFamily(flail, [bouncingFlail, incompatibleFlail], false);
