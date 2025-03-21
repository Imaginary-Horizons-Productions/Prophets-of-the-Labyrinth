const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

//#region Base
const longsword = new GearTemplate("Longsword",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe, gain @{levelUps} extra level after combat if they're downed"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Fire"
).setCost(200)
	.setEffect(longswordEffect, { type: "single", team: "foe" })
	.setUpgrades("Double Longsword", "Lethal Longsword")
	.setCooldown(2)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		levelUps: 1
	});

/** @type {typeof longsword.effect} */
function longswordEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, levelUps } } = longsword;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (survivors.length < targets.length) {
		adventure.room.addResource(`levelsGained${SAFE_DELIMITER}${adventure.getCombatantIndex(user)}`, "levelsGained", "loot", levelUps);
		resultLines.push(`${user.name} gains a level.`);
	}
	return resultLines;
}
//#endregion Base

//#region Double
const doubleLongsword = new GearTemplate("Double Longsword",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe twice, gain @{levelUps} extra level after combat if they're downed"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Fire"
).setCost(350)
	.setEffect(doubleLongswordEffect, { type: "single", team: "foe" })
	.setCooldown(2)
	.setScalings({
		damage: damageScalingGenerator(20),
		critBonus: 2,
		levelUps: 1
	});

/** @type {typeof doubleLongsword.effect} */
function doubleLongswordEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, levelUps } } = doubleLongsword;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines: firstresultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	const { resultLines: secondresultLines, survivors: finalSurvivors } = dealDamage(survivors, user, pendingDamage, false, essence, adventure);
	const allresultLines = firstresultLines.concat(secondresultLines);
	if (user.essence === essence) {
		changeStagger(finalSurvivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (finalSurvivors.length < targets.length) {
		adventure.room.addResource(`levelsGained${SAFE_DELIMITER}${adventure.getCombatantIndex(user)}`, "levelsGained", "loot", levelUps);
		allresultLines.push(`${user.name} gains a level.`);
	}
	return allresultLines;
}
//#endregion Double

//#region Lethal
const lethalLongsword = new GearTemplate("Lethal Longsword",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe, gain @{levelUps} extra level after combat if they're downed"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Fire",
	350,
).setEffect(lethalLongswordEffect, { type: "single", team: "foe" })
	.setCooldown(2)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 3,
		levelUps: 1
	});

/** @type {typeof lethalLongsword.effect} */
function lethalLongswordEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, levelUps } } = lethalLongsword;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (survivors.length < targets.length) {
		adventure.room.addResource(`levelsGained${SAFE_DELIMITER}${adventure.getCombatantIndex(user)}`, "levelsGained", "loot", levelUps);
		resultLines.push(`${user.name} gains a level.`);
	}
	return resultLines;
}
//#endregion Lethal

module.exports = new GearFamily(longsword, [doubleLongsword, lethalLongsword], false);
