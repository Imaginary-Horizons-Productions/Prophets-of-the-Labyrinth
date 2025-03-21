const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addModifier, combineModifierReceipts, generateModifierResultLines } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');
const { scalingSwiftness } = require('./shared/modifiers');
const { damageScalingGenerator } = require('./shared/scalings');

//#region Base
const tornadoFormation = new GearTemplate("Tornado Formation",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and grant all allies <@{mod0Stacks}> @{mod0}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Maneuver",
	"Wind"
).setCost(200)
	.setEffect(tornadoFormationEffect, { type: "single", team: "foe" })
	.setMoraleRequirement(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers(scalingSwiftness(2));

/** @type {typeof tornadoFormation.effect} */
function tornadoFormationEffect(targets, user, adventure) {
	const { essence, moraleRequirement, scalings: { damage, critBonus }, modifiers: [swiftness] } = tornadoFormation;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const pendingSwiftness = { name: swiftness.name, stacks: swiftness.stacks.calculate(user) };
	const userTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
	if (user.crit) {
		pendingSwiftness.stacks *= critBonus;
	}
	resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(userTeam, pendingSwiftness))));
	return resultLines;
}
//#endregion Base

//#region Charging
const chargingTornadoFormation = new GearTemplate("Charging Tornado Formation",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and grant all allies <@{mod0Stacks}> @{mod0} and @{mod1Stacks} @{mod1}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Maneuver",
	"Wind"
).setCost(350)
	.setEffect(chargingTornadoFormationEffect, { type: "single", team: "foe" })
	.setMoraleRequirement(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers(scalingSwiftness(2), { name: "Empowerment", stacks: 25 });

/** @type {typeof chargingTornadoFormation.effect} */
function chargingTornadoFormationEffect(targets, user, adventure) {
	const { essence, moraleRequirement, scalings: { damage, critBonus }, modifiers: [swiftness, empowerment] } = chargingTornadoFormation;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const receipts = [];
	const pendingSwiftness = { name: swiftness.name, stacks: swiftness.stacks.calculate(user) };
	const userTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
	if (user.crit) {
		pendingSwiftness.stacks *= critBonus;
	}
	receipts.push(...addModifier(userTeam, pendingSwiftness).concat(addModifier(userTeam, empowerment)));
	return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
}
//#endregion Charging

//#region Supportive
const supportiveTornadoFormation = new GearTemplate("Supportive Tornado Formation",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe, then grant <@{mod0Stacks}> @{mod0} to and relieve @{staggerRelief} Stagger for all allies"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Maneuver",
	"Wind"
).setCost(350)
	.setEffect(supportiveTornadoFormationEffect, { type: "single", team: "foe" })
	.setMoraleRequirement(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		staggerRelief: 2
	})
	.setModifiers(scalingSwiftness(2));

/** @type {typeof supportiveTornadoFormation.effect} */
function supportiveTornadoFormationEffect(targets, user, adventure) {
	const { essence, moraleRequirement, scalings: { damage, critBonus, staggerRelief }, modifiers: [swiftness] } = supportiveTornadoFormation;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const pendingStagger = { name: swiftness.name, stacks: swiftness.stacks.calculate(user) };
	const userTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
	if (user.crit) {
		pendingStagger.stacks *= critBonus;
	}
	resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(userTeam, pendingStagger))));
	changeStagger(userTeam, user, staggerRelief);
	return resultLines.concat(joinAsStatement(false, userTeam.map(combatant => combatant.name), "is", "are", "relieved of Stagger."));
}
//#endregion Supportive

module.exports = new GearFamily(tornadoFormation, [chargingTornadoFormation, supportiveTornadoFormation], false);
