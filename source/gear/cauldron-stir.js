const { GearTemplate, GearFamily } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { rollablePotions } = require('../shared/potions');
const { dealDamage, changeStagger, addModifier, getCombatantCounters } = require('../util/combatantUtil');
const { essenceList } = require('../util/essenceUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

//#region Base
const cauldronStir = new GearTemplate("Cauldron Stir",
	[
		["use", "Strike a foe for <@{damage}> @{essence} damage"],
		["critical", "Damage x @{critBonus}, add @{potionCount} random potion to loot"]
	],
	"Action",
	"Light"
).setEffect(cauldronStirEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		potionCount: 1
	})
	.setRnConfig({ potions: 1 });

/** @type {typeof cauldronStir.effect} */
function cauldronStirEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, potionCount } } = cauldronStir;
	const results = [];
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
		const rolledPotion = rollablePotions[user.roundRns[`${cauldronStir.name}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
		adventure.room.addResource(rolledPotion, "Item", "loot", potionCount);
		results.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
	}
	const { results: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return damageResults.concat(results);
}
//#endregion Base

//#region Incompatible
const incompatibleCauldronStir = new GearTemplate("Incompatible Cauldron Stir",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}, add @{potionCount} random potion to loot"]
	],
	"Action",
	"Light"
).setEffect(incompatibleCauldronStirEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		potionCount: 1
	})
	.setRnConfig({ potions: 1 })
	.setModifiers({ name: "Incompatibility", stacks: 3 });

/** @type {typeof incompatibleCauldronStir.effect} */
function incompatibleCauldronStirEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, potionCount }, modifiers: [incompatible] } = incompatibleCauldronStir;
	const results = addModifier(targets, incompatible);
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
		const rolledPotion = rollablePotions[user.roundRns[`${incompatibleCauldronStir.name}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
		adventure.room.addResource(rolledPotion, "Item", "loot", potionCount);
		results.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
	}
	const { results: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return damageResults.concat(results);
}
//#endregion Incompatible

//#region Innovative
const innovativeCauldronStir = new GearTemplate("Innovative Cauldron Stir",
	[
		["use", "Strike a foe for <@{damage}> @{essence} damage, grant all allies @{mod0Stacks} @{mod0} if Essence Countering"],
		["critical", "Damage x @{critBonus}, add @{potionCount} random potion to loot"]
	],
	"Action",
	"Light"
).setEffect(innovativeCauldronStirEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		potionCount: 1
	})
	.setRnConfig({ potions: 1 })
	.setModifiers({ name: "Empowerment", stacks: 10 });

/** @type {typeof innovativeCauldronStir.effect} */
function innovativeCauldronStirEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, potionCount }, modifiers: [empowerment] } = innovativeCauldronStir;
	const results = [];
	if (getCombatantCounters(targets[0]).includes(this.essence)) {
		const userTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
		results.push(...addModifier(userTeam, empowerment));
	}
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
		const rolledPotion = rollablePotions[user.roundRns[`${innovativeCauldronStir.name}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
		adventure.room.addResource(rolledPotion, "Item", "loot", potionCount);
		results.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
	}
	const { results: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return damageResults.concat(results);
}
//#endregion Innovative

//#region Sabotaging
const sabotagingCauldronStir = new GearTemplate("Sabotaging Cauldron Stir",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} stacks of a random Vulnerability on a foe"],
		["critical", "Damage x @{critBonus}, add @{potionCount} random potion to loot"]
	],
	"Action",
	"Light"
).setEffect(sabotagingCauldronStirEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		potionCount: 1
	})
	.setRnConfig({
		potions: 1,
		vulnerabilities: 1
	})
	.setModifiers({ name: "unparsed random vulnerability", stacks: 2 });

/** @type {typeof sabotagingCauldronStir.effect} */
function sabotagingCauldronStirEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, potionCount }, modifiers: [vulnerability] } = sabotagingCauldronStir;
	const results = [];
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
		const rolledPotion = rollablePotions[user.roundRns[`${sabotagingCauldronStir.name}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
		adventure.room.addResource(rolledPotion, "Item", "loot", potionCount);
		results.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
	}
	const { results: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const rolledVulnerability = essenceList(["Unaligned"])[user.roundRns[`${sabotagingName}${SAFE_DELIMITER}vulnerabilities`][0]];
	return damageResults.concat(results, addModifier(survivors, { name: `${rolledVulnerability} Vulnerability`, stacks: vulnerability.stacks }));
}
//#endregion Sabotaging

//#region Toxic
const toxicCauldronStir = new GearTemplate("Toxic Cauldron Stir",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}, add @{potionCount} random potion to loot"]
	],
	"Action",
	"Light"
).setEffect(toxicCauldronStirEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		potionCount: 1
	})
	.setRnConfig({ potions: 1 })
	.setModifiers({ name: "Poison", stacks: 3 });

/** @type {typeof toxicCauldronStir.effect} */
function toxicCauldronStirEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, potionCount }, modifiers: [poison] } = toxicCauldronStir;
	const results = [];
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
		const rolledPotion = rollablePotions[user.roundRns[`${toxicCauldronStir.name}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
		adventure.room.addResource(rolledPotion, "Item", "loot", potionCount);
		results.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
	}
	const { resultLines: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return damageResults.concat(results, addModifier(survivors, poison));
}
//#endregion Toxic

module.exports = new GearFamily(cauldronStir, [incompatibleCauldronStir, innovativeCauldronStir, sabotagingCauldronStir, toxicCauldronStir], true);
