const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier, gainHealth } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

//#region Base
const bountyFist = new GearTemplate("Bounty Fist",
	[
		["use", "Deal <@{damage} + gold paid> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Pact",
	"Earth"
).setCost(200)
	.setEffect(bountyFistEffect, { type: "single", team: "foe" })
	.setPactCost([10, "@{pactCost}% of party gold"])
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	});

/** @type {typeof bountyFist.effect} */
function bountyFistEffect(targets, user, adventure) {
	const { essence, pactCost, scalings: { damage, critBonus } } = bountyFist;
	const goldUsed = Math.floor(adventure.gold * (pactCost[0] / 100));
	adventure.gold -= goldUsed;
	let pendingDamage = damage.calculate(user) + goldUsed;
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(`${user.name}'s ${bountyFist.name} consumed ${goldUsed}g.`);
}
//#endregion Base

//#region Midas's
const midassBountyFist = new GearTemplate("Midas's Bounty Fist",
	[
		["use", "Inflict <@{damage} + gold paid> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Pact",
	"Earth"
).setCost(350)
	.setEffect(midassBountyFistEffect, { type: "single", team: "foe" })
	.setPactCost([10, "@{pactCost}% of party gold"])
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers({ name: "Curse of Midas", stacks: 2 });

/** @type {typeof midassBountyFist.effect} */
function midassBountyFistEffect(targets, user, adventure) {
	const { essence, pactCost, scalings: { damage, critBonus }, modifiers: [curseOfMidas] } = midassBountyFist;
	const goldUsed = Math.floor(adventure.gold * (pactCost[0] / 100));
	adventure.gold -= goldUsed;
	let pendingDamage = damage.calculate(user) + goldUsed;
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(addModifier(targets, curseOfMidas)), `${user.name}'s ${midassBountyFist.name} consumed ${goldUsed}g.`);
}
//#endregion Midas's

//#region Thirsting
const thirstingBountyFist = new GearTemplate("Thirsting Bounty Fist",
	[
		["use", "Deal <@{damage} + gold paid> @{essence} damage to a foe, regain <@{healing}> if foe is downed"],
		["critical", "Damage x @{critBonus}"]
	],
	"Pact",
	"Earth"
).setCost(350)
	.setEffect(thirstingBountyFistEffect, { type: "single", team: "foe" })
	.setPactCost([10, "@{pactCost}% of party gold"])
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		healing: { description: "10% Max HP", calculate: (user) => Math.floor(user.getMaxHP() / 10) }
	});

/** @type {typeof thirstingBountyFist.effect} */
function thirstingBountyFistEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, healing }, pactCost } = thirstingBountyFist;
	const goldUsed = Math.floor(adventure.gold * (pactCost[0] / 100));
	adventure.gold -= goldUsed;
	let pendingDamage = damage.calculate(user) + goldUsed;
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (survivors.length < targets.length) {
		const pendingHealing = healing.calculate(user);
		gainHealth(user, pendingHealing, adventure);
		resultLines.push(`${user.name} regains ${pendingHealing} HP.`);
	}
	return resultLines.concat(`${user.name}'s ${thirstingBountyFist.name} consumed ${goldUsed}g.`);
}
//#endregion Thirsting

module.exports = new GearFamily(bountyFist, [midassBountyFist, thirstingBountyFist], false);
