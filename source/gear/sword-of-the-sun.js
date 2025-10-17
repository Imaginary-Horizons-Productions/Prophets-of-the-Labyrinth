const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { dealDamage, changeStagger, removeModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

const targetingTags = { type: "single", team: "foe" };

//#region Base
const swordOfTheSun = new GearTemplate("Sword of the Sun",
	[
		["use", "Removes all buffs from a foe, then deal <@{damage} + 30 per unique buff removed> @{essence} damage to a them"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Fire"
).setCost(300)
	.setEffect(swordOfTheSunEffect, targetingTags)
	.setCooldown(3)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	});

/** @type {typeof swordOfTheSun.effect} */
function swordOfTheSunEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus } } = swordOfTheSun;
	const results = [];
	for (const target of targets) {
		const targetBuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
		targetBuffs.forEach(buffName => {
			results.push(...removeModifier([target], { name: buffName, stacks: "all" }))
		})

		let pendingDamage = damage.calculate(user) + 30 * combinedReceipts.reduce((total, receipt) => total + receipt.succeeded.size, 0);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { results: damageResults, survivors } = dealDamage([target], user, pendingDamage, false, essence, adventure);
		results.push(...damageResults)
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
	}

	return results;
}
//#endregion Base

//#region Lethal
const lethalSwordOfTheSun = new GearTemplate("Lethal Sword of the Sun",
	[
		["use", "Removes all buffs from a foe, then deal <@{damage} + 30 per unique buff removed> @{essence} damage to a them"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Fire"
).setCost(450)
	.setEffect(lethalSwordOfTheSunEffect, targetingTags)
	.setCooldown(3)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 3
	});

/** @type {typeof lethalSwordOfTheSun.effect} */
function lethalSwordOfTheSunEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus } } = lethalSwordOfTheSun;
	const results = [];
	for (const target of targets) {
		const targetBuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
		targetBuffs.forEach(buffName => {
			results.push(...removeModifier([target], { name: buffName, stacks: "all" }))
		})

		let pendingDamage = damage.calculate(user) + 30 * combinedReceipts.reduce((total, receipt) => total + receipt.succeeded.size, 0);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { results: damageResults, survivors } = dealDamage([target], user, pendingDamage, false, essence, adventure);
		results.push(...damageResults)
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
	}

	return results;
}
//#endregion Lethal

//#region Thief's
const thiefsSwordOfTheSun = new GearTemplate("Thief's Sword of the Sun",
	[
		["use", "Removes all buffs from a foe, then deal <@{damage} + 30 per unique buff removed> @{essence} damage to a them, then gain @{bounty}g if they're downed."],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Fire"
).setCost(450)
	.setEffect(thiefsSwordOfTheSunEffect, targetingTags)
	.setCooldown(3)
	.setFlavorText("This is a habit, isn't it?")
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		bounty: 30
	});

/** @type {typeof thiefsSwordOfTheSun.effect} */
function thiefsSwordOfTheSunEffect(targets, user, adventure) {
	const results = [];
	for (const target of targets) {
		const targetBuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
		targetBuffs.forEach(buffName => {
			results.push(...removeModifier([target], { name: buffName, stacks: "all" }))
		})

		const { essence, scalinge: { damage, critBonus } } = thiefsSwordOfTheSun;
		let pendingDamage = damage.calculate(user) + 30 * combinedReceipts.reduce((total, receipt) => total + receipt.succeeded.size, 0);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { results: damageResults, survivors } = dealDamage([target], user, pendingDamage, false, essence, adventure);
		results.push(...damageResults)
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
	}

	const { bounty } = thiefsSwordOfTheSun.scalings
	if (targets.find(t => t.hp <= 0) !== undefined) {
		adventure.room.addResource("Gold", "Currency", "loot", bounty);
		results.push(`${user.name} pillages ${bounty}g.`);
	}
	return results
}
//#endregion Thief's

module.exports = new GearFamily(swordOfTheSun, [lethalSwordOfTheSun, thiefsSwordOfTheSun], false);
