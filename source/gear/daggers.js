const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

//#region Base
const daggers = new GearTemplate("Daggers",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and gain @{mod0Stacks} @{mod0}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire",
).setEffect(daggersEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Excellence", stacks: 2 });

/** @type {typeof daggers.effect} */
function daggersEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [excellence] } = daggers;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return results.concat(addModifier([user], excellence));
}
//#endregion Base

//#region Attuned
const attunedDaggers = new GearTemplate("Attuned Daggers",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire"
).setEffect(attunedDaggersEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Excellence", stacks: 2 }, { name: "Attunement", stacks: 2 });

/** @type {typeof attunedDaggers.effect} */
function attunedDaggersEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [excellence, attunement] } = attunedDaggers;
	let pendingDamge = damage.calculate(user);
	if (user.crit) {
		pendingDamge *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamge, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return results.concat(addModifier([user], excellence), addModifier([user], attunement));
}
//#endregion Attuned

//#region Balanced
const balancedDaggers = new GearTemplate("Balanced Daggers",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire"
).setEffect(balancedDaggersEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Excellence", stacks: 2 }, { name: "Finesse", stacks: 1 });

/** @type {typeof balancedDaggers.effect} */
function balancedDaggersEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [excellence, finesse] } = balancedDaggers;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return results.concat(addModifier([user], excellence), addModifier([user], finesse));
}
//#endregion Balanced

//#region Centering
const centeringDaggers = new GearTemplate("Centering Daggers",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe, gain @{mod0Stacks} @{mod0}, and shrug off @{selfStagger*-1} Stagger"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire",
).setEffect(centeringDaggersEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		selfStagger: -2
	})
	.setModifiers({ name: "Excellence", stacks: 2 });

/** @type {typeof centeringDaggers.effect} */
function centeringDaggersEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, selfStagger }, modifiers: [excellence] } = centeringDaggers;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	results.push(...changeStagger([user], user, selfStagger));
	return results.concat(addModifier([user], excellence));
}
//#endregion Centering

//#region Distracting
const distractingDaggers = new GearTemplate("Distracting Daggers",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod1Stacks} @{mod1} on a foe and gain @{mod0Stacks} @{mod0}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire",
).setEffect(distractingDaggersEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Excellence", stacks: 2 }, { name: "Distraction", stacks: 2 });

/** @type {typeof distractingDaggers.effect} */
function distractingDaggersEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [excellence, distraction] } = distractingDaggers;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return results.concat(addModifier([user], excellence), addModifier(targets, distraction));
}
//#endregion Distracting

module.exports = new GearFamily(daggers, [attunedDaggers, balancedDaggers, centeringDaggers, distractingDaggers], true);
