const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { concatTeamMembersWithModifier, changeStagger, dealDamage } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');
const { accuratePassive, unstoppablePassive } = require('./shared/passiveDescriptions');

//#region Base
const overburnExplosion = new GearTemplate("Overburn Explosion",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and all foes with @{mod0}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Pact",
	"Fire"
).setCost(200)
	.setEffect(overburnExplosionEffect, { type: "single", team: "foe" })
	.setPactCost([2, "Set all your gears' cooldowns to @{pactCost}"])
	.setModifiers({ name: "Distraction", stacks: 0 })
	.setScalings({
		damage: damageScalingGenerator(200),
		critBonus: 2
	});

/** @type {typeof overburnExplosion.effect} */
function overburnExplosionEffect(targets, user, adventure) {
	const { essence, modifiers: [targetModifier], scalings: { damage, critBonus }, pactCost } = overburnExplosion;
	const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.room.enemies : adventure.delvers, targetModifier.name);
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(allTargets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (user.gear) {
		for (const gear of user.gear) {
			gear.cooldown += pactCost[0];
		}
		resultLines.push(`${user.name} is burnt out.`);
	}
	return resultLines;
}
//#endregion Base

//#region Accurate
const accurateOverburnExplosion = new GearTemplate("Accurate Overburn Explosion",
	[
		accuratePassive,
		["use", "Deal <@{damage}> @{essence} damage to a foe and all foes with @{mod0}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Pact",
	"Fire"
).setCost(350)
	.setEffect(accurateOverburnExplosionEffect, { type: "single", team: "foe" })
	.setPactCost([2, "Set all your gears' cooldowns to @{pactCost}"])
	.setModifiers({ name: "Distraction", stacks: 0 })
	.setScalings({
		damage: damageScalingGenerator(200),
		critBonus: 2,
		percentCritRate: 10
	});

/** @type {typeof accurateOverburnExplosion.effect} */
function accurateOverburnExplosionEffect(targets, user, adventure) {
	const { essence, modifiers: [targetModifier], scalings: { damage, critBonus }, pactCost } = accurateOverburnExplosion;
	const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.room.enemies : adventure.delvers, targetModifier.name);
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(allTargets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (user.gear) {
		for (const gear of user.gear) {
			gear.cooldown += pactCost[0];
		}
		resultLines.push(`${user.name} is burnt out.`);
	}
	return resultLines;
}
//#endregion Accurate

//#region Unstoppable
const unstoppableOverburnExplosion = new GearTemplate("Unstoppable Overburn Explosion",
	[
		unstoppablePassive,
		["use", "Deal <@{damage}> @{essence} damage to a foe and all foes with @{mod0}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Pact",
	"Fire"
).setCost(350)
	.setEffect(unstoppableOverburnExplosionEffect, { type: "single", team: "foe" })
	.setPactCost([2, "Set all your gears' cooldowns to @{pactCost}"])
	.setModifiers({ name: "Distraction", stacks: 0 })
	.setScalings({
		damage: damageScalingGenerator(200),
		critBonus: 2
	});

/** @type {typeof unstoppableOverburnExplosion.effect} */
function unstoppableOverburnExplosionEffect(targets, user, adventure) {
	const { essence, modifiers: [targetModifier], scalings: { damage, critBonus }, pactCost } = unstoppableOverburnExplosion;
	const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.room.enemies : adventure.delvers, targetModifier.name);
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(allTargets, user, pendingDamage, true, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (user.gear) {
		for (const gear of user.gear) {
			gear.cooldown += pactCost[0];
		}
		resultLines.push(`${user.name} is burnt out.`);
	}
	return resultLines;
}
//#endregion Unstoppable

module.exports = new GearFamily(overburnExplosion, [accurateOverburnExplosion, unstoppableOverburnExplosion], false);
