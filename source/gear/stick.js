const { GearTemplate, GearFamily } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { dealDamage, addModifier, changeStagger, removeModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

//#region Base
const stick = new GearTemplate("Stick",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Earth"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus }, modifiers: [impotence] } = stick;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return results.concat(addModifier(survivors, impotence));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Impotence", stacks: 3 });
//#endregion Base

//#region Convalescence
const convalescenceStick = new GearTemplate("Convalescence Stick",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe, then shrug off @{debuffsCured} random debuff"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Earth"
).setEffect(convalescenceStickEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		debuffsCured: 1
	})
	.setModifiers({ name: "Impotence", stacks: 3 })
	.setRnConfig({
		debuffs: 1
	});

/** @type {typeof convalescenceStick.effect} */
function convalescenceStickEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [impotence] } = convalescenceStick;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	results.push(...addModifier(survivors, impotence));
	const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
	results.push(...removeModifier([user], { name: userDebuffs[user.roundRns[`${convalescenceStick.name}${SAFE_DELIMITER}debuffs`][0] % userDebuffs.length], stacks: "all" }));
	return results;
}
//#endregion Convalescence

//#region Flanking
const flankingStick = new GearTemplate("Flanking Stick",
	[
		["use", "Inflict <@{damage}> @{essence} damage, @{mod0Stacks} @{mod0}, and @{mod1Stacks} @{mod1} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Earth"
).setEffect(flankingStickEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Impotence", stacks: 3 }, { name: "Exposure", stacks: 2 });

/** @type {typeof flankingStick.effect} */
function flankingStickEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [impotence, exposure] } = flankingStick;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return results.concat(addModifier(survivors, impotence), addModifier(survivors, exposure));
}
//#endregion Flanking

//#region Hunter's
const huntersStick = new GearTemplate("Hunter's Stick",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe, gain @{mod1Stacks} @{mod1} if they're downed"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Earth"
).setEffect(huntersStickEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Impotence", stacks: 3 }, { name: "Empowerment", stacks: 25 });

/** @type {typeof huntersStick.effect} */
function huntersStickEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [impotence, empowerment] } = huntersStick;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (survivors.length < targets.length) {
		results.push(...addModifier([user], empowerment));
	}
	return results.concat(addModifier(survivors, impotence));
}
//#endregion Hunter's

//#region Thief's
const thiefsStick = new GearTemplate("Thief's Stick",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe, gain @{bounty}g if they're downed"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Earth"
).setEffect(thiefsStickEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		bounty: 30
	})
	.setModifiers({ name: "Impotence", stacks: 3 });

/** @type {typeof thiefsStick.effect} */
function thiefsStickEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, bounty }, modifiers: [impotence] } = thiefsStick;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (survivors.length < targets.length) {
		adventure.room.addResource("Gold", "Currency", "loot", bounty);
		results.push(`${user.name} pillages ${bounty}g.`);
	}
	return results.concat(addModifier(survivors, impotence));
}
//#endregion Thief's

module.exports = new GearFamily(stick, [convalescenceStick, flankingStick, huntersStick, thiefsStick], true);
