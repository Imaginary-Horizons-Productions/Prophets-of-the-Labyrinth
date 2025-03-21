const { GearTemplate, GearFamily, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addProtection, addModifier, generateModifierResultLines } = require('../util/combatantUtil');
const { protectionScalingGenerator, archetypeActionDamageScaling } = require('./shared/scalings');

//#region Base
const lance = new GearTemplate("Lance",
	[
		["use", "Gain <@{protection}> protection, then deal <@{damage}> @{essence} damage to a foe"],
		["critical", "Protection x @{critBonus}"]
	],
	"Action",
	"Water"
).setEffect(lanceEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		protection: protectionScalingGenerator(25)
	});

/** @type {typeof lance.effect} */
function lanceEffect(targets, user, adventure) {
	const { essence, scalings: { damage, protection, critBonus } } = lance;
	let pendingProtection = protection.calculate(user);
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection([user], pendingProtection);
	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(`${user.name} gains protection.`);
}
//#endregion Base

//#region Accelerating
const acceleratingLance = new GearTemplate("Accelerating Lance",
	[
		["use", "Gain <@{protection}> protection and @{mod0Stacks} @{mod0}, then deal <@{damage}> @{essence} damage to a foe"],
		["critical", "Protection x @{critBonus}"]
	],
	"Action",
	"Water"
).setEffect(acceleratingLanceEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		protection: protectionScalingGenerator(25)
	})
	.setModifiers({ name: "Swiftness", stacks: 3 });

/** @type {typeof acceleratingLance.effect} */
function acceleratingLanceEffect(targets, user, adventure) {
	const { essence, scalings: { damage, protection, critBonus }, modifiers: [swiftness] } = acceleratingLance;
	let pendingProtection = protection.calculate(user);
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection([user], pendingProtection);
	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(`${user.name} gains protection.`, generateModifierResultLines(addModifier([user], swiftness)));
}
//#endregion Accelerating

//#region Bashing
const bashingLance = new GearTemplate("Bashing Lance",
	[
		["use", "Gain <@{protection}> protection, then deal <@{damage}> @{essence} damage to a foe"],
		["critical", "Protection x @{critBonus}"]
	],
	"Action",
	"Water"
).setEffect(bashingLanceEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: { description: "Power + protection", calculate: (user) => user.getPower() + user.protection },
		critBonus: 2,
		protection: protectionScalingGenerator(25)
	});

/** @type {typeof bashingLance.effect} */
function bashingLanceEffect(targets, user, adventure) {
	const { essence, scalings: { damage, protection, critBonus } } = bashingLance;
	let pendingProtection = protection.calculate(user);
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection([user], pendingProtection);
	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(`${user.name} gains protection.`);
}
//#endregion Bashing

//#region Juggernaut's
const juggernautsLance = new GearTemplate("Juggernaut's Lance",
	[
		["use", "Gain <@{protection}> protection twice, then deal <@{damage}> @{essence} damage to a foe"],
		["critical", "Protection x @{critBonus}"]
	],
	"Action",
	"Water"
).setEffect(juggernautsLanceEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		protection: protectionScalingGenerator(12)
	});

/** @type {typeof juggernautsLance.effect} */
function juggernautsLanceEffect(targets, user, adventure) {
	const { essence, scalings: { damage, protection, critBonus } } = juggernautsLance;
	let pendingProtection = protection.calculate(user);
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection([user], pendingProtection);
	addProtection([user], pendingProtection);
	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(`${user.name} gains protection.`);
}
//#endregion Juggernaut's

//#region Taunting
const tauntingLance = new GearTemplate("Taunting Lance",
	[
		["use", "Gain <@{protection}> protection, then deal <@{damage}> @{essence} damage to a foe"],
		["critical", "Protection x @{critBonus}"]
	],
	"Action",
	"Water"
).setEffect(tauntingLanceEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		protection: protectionScalingGenerator(25)
	});

/** @type {typeof tauntingLance.effect} */
function tauntingLanceEffect([target], user, adventure) {
	const { essence, scalings: { damage, protection, critBonus } } = tauntingLance;
	let pendingProtection = protection.calculate(user);
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection([user], pendingProtection);
	const { resultLines, survivors } = dealDamage([target], user, damage.calculate(user), false, essence, adventure);
	resultLines.push(`${user.name} gains protection.`);
	if (survivors.length > 0) {
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			resultLines.push(`${target.name} falls for the provocation.`);
		}
	}
	return resultLines;
}
//#endregion Taunting

module.exports = new GearFamily(lance, [acceleratingLance, bashingLance, juggernautsLance, tauntingLance], true);
