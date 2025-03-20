const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, dealDamage, generateModifierResultLines, removeModifier, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

//#region Base
const battleStandard = new GearTemplate("Battle Standard",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}, increase party morale by @{morale}"]
	],
	"Action",
	"Light"
).setEffect(battleStandardEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		morale: 1
	});

/** @type {typeof battleStandard.effect} */
function battleStandardEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, morale } } = battleStandard;
	let pendingDamage = damage.calculate(user);
	const resultLines = [];
	if (user.crit) {
		pendingDamage *= critBonus;
		adventure.room.morale += morale;
		resultLines.push("The party's morale is increased!")
	}
	const { resultLines: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return damageResults.concat(resultLines);
}
//#endregion Base

//#region Disenchanting
const disenchantingBattleStandard = new GearTemplate("Disenchanting Battle Standard",
	[
		["use", "Deal <@{damage}> @{essence} damage to and remove a random buff from a foe"],
		["critical", "Damage x @{critBonus}, increase party morale by @{morale}"]
	],
	"Action",
	"Light"
).setEffect(disenchantingBattleStandardEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		morale: 1
	})
	.setRnConfig({
		buffs: 1
	});

/** @type {typeof disenchantingBattleStandard.effect} */
function disenchantingBattleStandardEffect([target], user, adventure) {
	const { essence, scalings: { damage, critBonus, morale } } = disenchantingBattleStandard;
	let pendingDamage = damage.calculate(user);
	const resultLines = [];
	if (user.crit) {
		pendingDamage *= critBonus;
		adventure.room.morale += morale;
		resultLines.push("The party's morale is increased!")
	}
	const { resultLines: damageResults } = dealDamage([target], user, pendingDamage, false, essence, adventure);
	if (target.hp > 0) {
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const targetBuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
		resultLines.push(...generateModifierResultLines(removeModifier([target], { name: targetBuffs[user.roundRns[`${disenchantingBattleStandard.name}${SAFE_DELIMITER}buffs`][0] % targetBuffs.length], stacks: "all" })));
	}
	return damageResults.concat(resultLines);
}
//#endregion Disenchanting

//#region Flanking
const flankingBattleStandard = new GearTemplate("Flanking Battle Standard",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}, increase party morale by @{morale}"]
	],
	"Action",
	"Light"
).setEffect(flankingBattleStandardEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		morale: 1
	})
	.setModifiers({ name: "Exposure", stacks: 2 });

function flankingBattleStandardEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, morale }, modifiers: [exposure] } = flankingBattleStandard;
	let pendingDamage = damage.calculate(user);
	const resultLines = [];
	if (user.crit) {
		pendingDamage *= critBonus;
		adventure.room.morale += morale;
		resultLines.push("The party's morale is increased!")
	}
	const { resultLines: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return damageResults.concat(resultLines, generateModifierResultLines(addModifier(survivors, exposure)));
}
//#endregion Flanking

//#region Hastening
const hasteningBattleStandard = new GearTemplate("Hastening Battle Standard",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}, increase party morale by @{morale}, reduce your cooldowns by @{cooldownReduction}"]
	],
	"Action",
	"Light"
).setEffect(hasteningBattleStandardEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		morale: 1,
		cooldownReduction: 1
	});

function hasteningBattleStandardEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, morale, cooldownReduction } } = hasteningBattleStandard;
	let pendingDamage = damage.calculate(user);
	const resultLines = [];
	if (user.crit) {
		pendingDamage *= critBonus;
		adventure.room.morale += morale;
		resultLines.push("The party's morale is increased!");
		user.gear?.forEach(gear => {
			if (gear.cooldown > 1) {
				gear.cooldown -= cooldownReduction;
			}
		})
		resultLines.push(`${user.name}'s cooldowns are hastened.`);
	}
	const { resultLines: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return damageResults.concat(resultLines);
}
//#endregion Hastening

//#region Weakening
const weakeningBattleStandard = new GearTemplate("Weakening Battle Standard",
	[
		["use", "Inflcit <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}, increase party morale by @{morale}"]
	],
	"Action",
	"Light"
).setEffect(weakeningBattleStandardEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		morale: 1
	})
	.setModifiers({ name: "Weakness", stacks: 10 });

function weakeningBattleStandardEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, morale }, modifiers: [weakness] } = weakeningBattleStandard;
	let pendingDamage = damage.calculate(user);
	const resultLines = [];
	if (user.crit) {
		pendingDamage *= critBonus;
		adventure.room.morale += morale;
		resultLines.push("The party's morale is increased!")
	}
	const { resultLines: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return damageResults.concat(resultLines, generateModifierResultLines(addModifier(survivors, weakness)));
}
//#endregion Weakening

module.exports = new GearFamily(battleStandard, [disenchantingBattleStandard, flankingBattleStandard, hasteningBattleStandard, weakeningBattleStandard], true);
