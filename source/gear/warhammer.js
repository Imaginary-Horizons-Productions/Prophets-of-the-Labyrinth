const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

//#region Base
const warhammer = new GearTemplate("Warhammer",
	[
		["use", "Deal <@{damage} (+ @{awesomeBonus} if target is Stunned)> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Darkness"
).setCost(200)
	.setEffect(warhammerEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		awesomeBonus: 75
	});

/** @type {typeof warhammer.effect} */
function warhammerEffect(targets, user, adventure) {
	const { essence, scalings: { damage, awesomeBonus, critBonus } } = warhammer;
	let pendingDamage = damage.calculate(user);
	if (targets[0].isStunned) {
		pendingDamage += awesomeBonus;
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

//#region Fatiguing
const fatiguingWarhammer = new GearTemplate("Fatiguing Warhammer",
	[
		["use", "Inflict <@{damage} (+ @{awesomeBonus} if target is Stunned)> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Darkness"
).setCost(350)
	.setEffect(fatiguingWarhammerEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		awesomeBonus: 75
	})
	.setModifiers({ name: "Impotence", stacks: 2 });

/** @type {typeof fatiguingWarhammer.effect} */
function fatiguingWarhammerEffect(targets, user, adventure) {
	const { essence, scalings: { damage, awesomeBonus, critBonus }, modifiers: [impotence] } = fatiguingWarhammer;
	let pendingDamage = damage.calculate(user);
	if (targets[0].isStunned) {
		pendingDamage += awesomeBonus;
	}
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (survivors.length > 0) {
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		results.push(...addModifier(survivors, impotence));
	}
	return results;
}
//#endregion Fatiguing

//#region Toxic
const toxicWarhammer = new GearTemplate("Toxic Warhammer",
	[
		["use", "Deal <@{damage} (+ @{awesomeBonus} if target is Stunned)> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Darkness"
).setCost(350)
	.setEffect(toxicWarhammerEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		awesomeBonus: 75
	})
	.setModifiers({ name: "Poison", stacks: 3 });

/** @type {typeof toxicWarhammer.effect} */
function toxicWarhammerEffect(targets, user, adventure) {
	const { essence, scalings: { damage, awesomeBonus, critBonus }, modifiers: [poison] } = toxicWarhammer;
	let pendingDamage = damage.calculate(user);
	if (targets[0].isStunned) {
		pendingDamage += awesomeBonus;
	}
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (survivors.length > 0) {
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		results.push(...addModifier(survivors, poison));
	}
	return results;
}
//#endregion Toxic

module.exports = new GearFamily(warhammer, [fatiguingWarhammer, toxicWarhammer], false);
