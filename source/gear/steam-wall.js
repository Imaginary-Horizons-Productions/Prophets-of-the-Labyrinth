const { GearTemplate, GearFamily } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection, addModifier } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

//#region Base
const steamWall = new GearTemplate("Steam Wall",
	[
		["use", "Grant <@{protection}> protection to an ally and adjacent allies"],
		["critical", "Protection x @{critBonus}"]
	],
	"Maneuver",
	"Water"
).setCost(200)
	.setEffect(steamWallEffect, { type: `blast${SAFE_DELIMITER}1`, team: "ally" })
	.setMoraleRequirement(1)
	.setScalings({
		protection: protectionScalingGenerator(125),
		critBonus: 2
	});

/** @type {typeof steamWall.effect} */
function steamWallEffect(targets, user, adventure) {
	const { essence, moraleRequirement, scalings: { protection, critBonus } } = steamWall;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	let pendingProtection = protection.calculate(user);
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection(targets, pendingProtection);
	return [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection.")];
}
//#endregion Base

//#region Supportive
const supportiveSteamWall = new GearTemplate("Supportive Steam Wall",
	[
		["use", "Grant <@{protection}> protection to and relieve @{staggerRelief} Stagger for an ally and adjacent allies"],
		["critical", "Protection x @{critBonus}"]
	],
	"Maneuver",
	"Water"
).setCost(350)
	.setEffect(supportiveSteamWallEffect, { type: `blast${SAFE_DELIMITER}1`, team: "ally" })
	.setMoraleRequirement(1)
	.setScalings({
		protection: protectionScalingGenerator(125),
		critBonus: 2,
		staggerRelief: 2
	});

/** @type {typeof supportiveSteamWall.effect} */
function supportiveSteamWallEffect(targets, user, adventure) {
	const { essence, moraleRequirement, scalings: { protection, critBonus, staggerRelief } } = supportiveSteamWall;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	let pendingProtection = protection.calculate(user);
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection(targets, pendingProtection);
	return [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection."), ...changeStagger(targets, user, staggerRelief)];
}
//#endregion Supportive

//#region Vigilant
const vigilantSteamWall = new GearTemplate("Vigilant Steam Wall",
	[
		["use", "Grant <@{protection}> protection to and @{mod0Stacks} @{mod0} for an ally and adjacent allies"],
		["critical", "Protection x @{critBonus}"]
	],
	"Maneuver",
	"Water"
).setCost(350)
	.setEffect(vigilantSteamWallEffect, { type: `blast${SAFE_DELIMITER}1`, team: "ally" })
	.setMoraleRequirement(1)
	.setScalings({
		protection: protectionScalingGenerator(125),
		critBonus: 2
	})
	.setModifiers({ name: "Vigilance", stacks: 2 });

/** @type {typeof vigilantSteamWall.effect} */
function vigilantSteamWallEffect(targets, user, adventure) {
	const { essence, moraleRequirement, scalings: { protection, critBonus }, modifiers: [vigilance] } = vigilantSteamWall;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	let pendingProtection = protection.calculate(user);
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection(targets, pendingProtection);
	return [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection."), ...addModifier(targets, vigilance)];
}
//#endregion Vigilant

module.exports = new GearFamily(steamWall, [supportiveSteamWall, vigilantSteamWall], false);
