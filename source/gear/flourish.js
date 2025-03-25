const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier, combineModifierReceipts } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

//#region Base
const flourish = new GearTemplate("Flourish",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect(flourishEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Distraction", stacks: 3 });

/** @type {typeof flourish.effect} */
function flourishEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [distraction] } = flourish;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(addModifier(survivors, distraction)));
}
//#endregion Base

//#region Bouncing
const bounces = 3;
const bouncingFlourish = new GearTemplate("Bouncing Flourish",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on @{bounces} random foes"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect(bouncingFlourishEffect, { type: `random${SAFE_DELIMITER}${bounces}`, team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		bounces
	})
	.setRnConfig({ foes: bounces })
	.setModifiers({ name: "Distraction", stacks: 3 });

/** @type {typeof bouncingFlourish.effect} */
function bouncingFlourishEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [distraction] } = bouncingFlourish;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(addModifier(survivors, distraction)));
}
//#endregion Bouncing

//#region Shattering
const shatteringFlourish = new GearTemplate("Shattering Flourish",
	[
		["use", "Inflict <@{damage}> @{essence} damage, @{mod0Stacks} @{mod0}, and @{mod1Stacks} @{mod1} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect(shatteringFlourishEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Distraction", stacks: 3 }, { name: "Frailty", stacks: 3 });

/** @type {typeof shatteringFlourish.effect} */
function shatteringFlourishEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [distraction, frailty] } = shatteringFlourish;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier(survivors, distraction).concat(addModifier(survivors, frailty)))));
}
//#endregion Shattering

//#region Staggering
const staggeringFlourish = new GearTemplate("Staggering Flourish",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect(staggeringFlourishEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Distraction", stacks: 3 })
	.setStagger(2);

/** @type {typeof staggeringFlourish.effect} */
function staggeringFlourishEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [distraction], stagger } = staggeringFlourish;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	let pendingStagger = stagger;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
	}
	changeStagger(survivors, user, pendingStagger);
	return resultLines.concat(generateModifierResultLines(addModifier(survivors, distraction)));
}
//#endregion Staggering

//#region Urgent
const urgentFlourish = new GearTemplate("Urgent Flourish",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe with priority"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect(flourishEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		priority: 1
	})
	.setModifiers({ name: "Distraction", stacks: 3 });
//#endregion Urgent

module.exports = new GearFamily(flourish, [bouncingFlourish, shatteringFlourish, staggeringFlourish, urgentFlourish], true);
