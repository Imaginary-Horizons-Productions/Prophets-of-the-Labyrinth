const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, dealDamage, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { scalingTorpidity } = require('./shared/modifiers');
const { damageScalingGenerator } = require('./shared/scalings');

//#region Base
const netLauncher = new GearTemplate("Net Launcher",
	[
		["use", "Inflict <@{damage}> @{essence} damage and <@{mod0Stacks}> @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}; inflict @{mod0} on all foes instead"]
	],
	"Offense",
	"Light"
).setCost(200)
	.setEffect(netLauncherEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({ damage: damageScalingGenerator(40), critBonus: 2 })
	.setModifiers(scalingTorpidity(3));

/** @type {typeof netLauncher.effect} */
function netLauncherEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [torpidity] } = netLauncher;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	let torpidityTargets = survivors;
	if (user.crit) {
		if (user.team === "delver") {
			torpidityTargets = adventure.room.enemies.filter(target => target.hp > 0);
		} else {
			torpidityTargets = adventure.delvers;
		}
	}
	return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier(torpidityTargets, { name: torpidity.name, stacks: torpidity.stacks.calculate(user) }))));
}
//#endregion Base

//#region Theif's
const thiefsNetLauncher = new GearTemplate("Thief's Net Launcher",
	[
		["use", "Inflict <@{damage}> @{essence} damage and <@{mod0Stacks}> @{mod0} on a foe, gain @{bounty}g if they're downed"],
		["critical", "Damage x @{critBonus}; inflict @{mod0} on all foes instead"]
	],
	"Offense",
	"Light"
).setCost(350)
	.setEffect(thiefsNetLauncherEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({ damage: damageScalingGenerator(40), critBonus: 2, bounty: 30 })
	.setModifiers(scalingTorpidity(3));

/** @type {typeof thiefsNetLauncher.effect} */
function thiefsNetLauncherEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, bounty }, modifiers: [torpidity] } = thiefsNetLauncher;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	let torpidityTargets = survivors;
	if (user.crit) {
		if (user.team === "delver") {
			torpidityTargets = adventure.room.enemies.filter(target => target.hp > 0);
		} else {
			torpidityTargets = adventure.delvers;
		}
	}
	if (survivors.length < targets.length) {
		const totalBounty = (targets.length - survivors.length) * bounty;
		adventure.room.addResource("Gold", "Currency", "loot", totalBounty);
		resultLines.push(`${user.name} pillages ${totalBounty}g.`);
	}
	return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier(torpidityTargets, { name: torpidity.name, stacks: torpidity.stacks.calculate(user) }))));
}
//#endregion Thief's

//#region Tormenting
const tormentingNetLauncher = new GearTemplate("Tormenting Net Launcher",
	[
		["use", "Inflict <@{damage}> @{essence} damage and <@{mod0Stacks}> @{mod0} on a foe and add @{debuffIncrement} stack to each of their debuffs"],
		["critical", "Damage x @{critBonus}; inflict @{mod0} on all foes instead"]
	],
	"Offense",
	"Light"
).setCost(350)
	.setEffect(tormentingNetLauncherEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({ damage: damageScalingGenerator(40), critBonus: 2, debuffIncrement: 1 })
	.setModifiers(scalingTorpidity(3));

/** @type {typeof tormentingNetLauncher.effect} */
function tormentingNetLauncherEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [torpidity] } = tormentingNetLauncher;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	let torpidityTargets = survivors;
	if (user.crit) {
		if (user.team === "delver") {
			torpidityTargets = adventure.room.enemies.filter(target => target.hp > 0);
		} else {
			torpidityTargets = adventure.delvers;
		}
	}
	const receipts = addModifier(torpidityTargets, { name: torpidity.name, stacks: torpidity.stacks.calculate(user) });
	for (const target of survivors) {
		for (const modifier in target.modifiers) {
			if (getModifierCategory(modifier) === "Debuff") {
				receipts.push(...addModifier([target], { name: modifier, stacks: debuffIncrement }));
			}
		}
	}
	return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
}
//#endregion Tormenting

module.exports = new GearFamily(netLauncher, [thiefsNetLauncher, tormentingNetLauncher], false);
