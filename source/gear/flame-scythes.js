const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, downedCheck, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

//#region Base
const flameScythes = new GearTemplate("Flame Scythes",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe, then execute them if they end below half your damage cap"],
		["critical", "Damage x @{critBonus}"]
	],
	"Spell",
	"Fire"
).setCost(200)
	.setEffect(flameScythesEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	});

/** @type {typeof flameScythes.effect} */
function flameScythesEffect([target], user, adventure) {
	const { essence, scalings: { damage, critBonus } } = flameScythes;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines } = dealDamage([target], user, pendingDamage, false, essence, adventure);
	if (target.hp < (user.getDamageCap() / 2)) {
		target.hp = 0;
		const { extraLines } = downedCheck(target, adventure);
		return [`${target.name} meets the reaper!`].concat(extraLines);
	} else {
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines;
	}
}
//#endregion Base

//#region Thief's
const thiefsFlameScythes = new GearTemplate("Thief's Flame Scythes",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe, then execute them and add @{bounty}g to loot if they end below half your damage cap"],
		["critical", "Damage x @{critBonus}"]
	],
	"Spell",
	"Fire"
).setCost(350)
	.setEffect(thiefsFlameScythesEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		bounty: 30
	});

/** @type {typeof thiefsFlameScythes.effect} */
function thiefsFlameScythesEffect([target], user, adventure) {
	const { essence, scalings: { damage, critBonus, bounty } } = thiefsFlameScythes;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines } = dealDamage([target], user, pendingDamage, false, essence, adventure);
	if (target.hp < (user.getDamageCap() / 2)) {
		target.hp = 0;
		const { extraLines } = downedCheck(target, adventure);
		adventure.room.addResource("Gold", "Currency", "loot", bounty);
		extraLines.push(`${user.name} pillages ${bounty}g.`);
		return [`${target.name} meets the reaper!`].concat(extraLines);
	} else {
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines;
	}
}
//#endregion Thief's

//#region Toxic
const toxicFlameScythes = new GearTemplate("Toxic Flame Scythes",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe, then execute them if they end below half your damage cap"],
		["critical", "Damage x @{critBonus}"]
	],
	"Spell",
	"Fire"
).setCost(350)
	.setEffect(toxicFlameScythesEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers({ name: "Poison", stacks: 3 });

/** @type {typeof toxicFlameScythes.effect} */
function toxicFlameScythesEffect([target], user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [poison] } = toxicFlameScythes;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines } = dealDamage([target], user, pendingDamage, false, essence, adventure);
	if (target.hp < (user.getDamageCap() / 2)) {
		target.hp = 0;
		const { extraLines } = downedCheck(target, adventure);
		return [`${target.name} meets the reaper!`].concat(extraLines);
	} else {
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines.concat(generateModifierResultLines(addModifier([target], poison)));
	}
}
//#endregion Toxic

module.exports = new GearFamily(flameScythes, [thiefsFlameScythes, toxicFlameScythes], false);
