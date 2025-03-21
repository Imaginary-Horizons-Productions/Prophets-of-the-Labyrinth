const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

//#region Base
const shortsword = new GearTemplate("Shortsword",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and gain @{mod0Stacks} @{mod0}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire"
).setEffect(shortswordEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Finesse", stacks: 1 });

/** @type {typeof shortsword.effect} */
function shortswordEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [finesse] } = shortsword;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(addModifier([user], finesse)));
}
//#endregion Base

//#region Flanking
const flankingShortsword = new GearTemplate("Flanking Shortsword",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod1Stacks} @{mod1} on a foe and gain @{mod0Stacks} @{mod0}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire"
).setEffect(flankingShortswordEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Finesse", stacks: 1 }, { name: "Exposure", stacks: 2 });

/** @type {typeof flankingShortsword.effect} */
function flankingShortswordEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [finesse, exposure] } = flankingShortsword;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(addModifier([user], finesse).concat(addModifier(survivors, exposure))));
}
//#endregion Flanking

//#region Hexing
const hexingShortsword = new GearTemplate("Hexing Shortsword",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod1Stacks} @{mod1} on a foe and gain @{mod0Stacks} @{mod0}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire"
).setEffect(hexingShortswordEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Finesse", stacks: 1 }, { name: "Misfortune", stacks: 8 });

/** @type {typeof hexingShortsword.effect} */
function hexingShortswordEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [finesse, misfortune] } = hexingShortsword;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(addModifier([user], finesse).concat(addModifier(survivors, misfortune))));
}
//#endregion Hexing

//#region Midas's
const midassShortsword = new GearTemplate("Midas's Shortsword",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod1Stacks} @{mod1} on a foe and gain @{mod0Stacks} @{mod0}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire"
).setEffect(midassShortswordEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Finesse", stacks: 1 }, { name: "Curse of Midas", stacks: 1 });

/** @type {typeof midassShortsword.effect} */
function midassShortswordEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [finesse, curseOfMidas] } = midassShortsword;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(addModifier([user], finesse).concat(addModifier(survivors, curseOfMidas))));
}
//#endregion Midas's

//#region Vigilant
const vigilantShortsword = new GearTemplate("Vigilant Shortsword",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire"
).setEffect(vigilantShortswordEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Finesse", stacks: 1 }, { name: "Vigilance", stacks: 2 });

/** @type {typeof vigilantShortsword.effect} */
function vigilantShortswordEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [finesse, vigilance] } = vigilantShortsword;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(addModifier([user], finesse).concat(addModifier([user], vigilance))));
}
//#endregion Vigilant

module.exports = new GearFamily(shortsword, [flankingShortsword, hexingShortsword, midassShortsword, vigilantShortsword], true);
