const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addModifier } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

//#region Base
const sandstormFormation = new GearTemplate("Sandstorm Formation",
	[
		["use", "Reduce all ally cooldowns by @{cooldownReduction}"],
		["critical", "Also grant @{mod0Stacks} @{mod0}"]
	],
	"Maneuver",
	"Earth"
).setCost(200)
	.setEffect(sandstormFormationEffect, { type: "all", team: "ally" })
	.setMoraleRequirement(2)
	.setScalings({ cooldownReduction: 1 })
	.setModifiers({ name: "Impact", stacks: 2 });

/** @type {typeof sandstormFormation.effect} */
function sandstormFormationEffect(targets, user, adventure) {
	const { essence, moraleRequirement, scalings: { cooldownReduction }, modifiers: [impact] } = sandstormFormation;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const hadCooldowns = [];
	for (const target of targets) {
		let didCooldown = false;
		target.gear?.forEach(gear => {
			if (gear.cooldown > 1) {
				didCooldown = true;
				gear.cooldown -= cooldownReduction;
			}
		})
		if (didCooldown) {
			hadCooldowns.push(target.name);
		}
	}
	const results = [];
	if (hadCooldowns.length > 0) {
		results.push(`${listifyEN(hadCooldowns)} had their cooldowns hastened.`);
	}
	if (user.crit) {
		results.push(...addModifier(targets, impact));
	}
	if (results.length > 0) {
		return results;
	} else {
		return ["...but nothing happened."];
	}
}
//#endregion Base

//#region Balanced
const balancedSandstormFormation = new GearTemplate("Balanced Sandstorm Formation",
	[
		["use", "Reduce all cooldowns by @{cooldownReduction} for and grant @{mod1Stacks} @{mod1} to all allies"],
		["critical", "Also grant @{mod0Stacks} @{mod0}"]
	],
	"Maneuver",
	"Earth"
).setCost(350)
	.setEffect(balancedSandstormFormationEffect, { type: "all", team: "ally" })
	.setMoraleRequirement(2)
	.setScalings({ cooldownReduction: 1 })
	.setModifiers({ name: "Impact", stacks: 2 }, { name: "Finesse", stacks: 1 });

/** @type {typeof balancedSandstormFormation.effect} */
function balancedSandstormFormationEffect(targets, user, adventure) {
	const { essence, moraleRequirement, scalings: { cooldownReduction }, modifiers: [impact, finesse] } = balancedSandstormFormation;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const hadCooldowns = [];
	for (const target of targets) {
		let didCooldown = false;
		target.gear?.forEach(gear => {
			if (gear.cooldown > 1) {
				didCooldown = true;
				gear.cooldown -= cooldownReduction;
			}
		})
		if (didCooldown) {
			hadCooldowns.push(target.name);
		}
	}
	const results = [];
	if (hadCooldowns.length > 0) {
		results.push(`${listifyEN(hadCooldowns)} had their cooldowns hastened.`);
	}
	if (user.crit) {
		results.push(...addModifier(targets, impact));
	}
	results.push(...addModifier(targets, finesse));
	return results;
}
//#endregion Balanced

//#region Soothing
const soothingSandstormFormation = new GearTemplate("Soothing Sandstorm Formation",
	[
		["use", "Reduce all cooldowns by @{cooldownReduction} for and grant @{mod1Stacks} @{mod1} to all allies"],
		["critical", "Also grant @{mod0Stacks} @{mod0}"]
	],
	"Maneuver",
	"Earth"
).setCost(350)
	.setEffect(soothingSandstormFormationEffect, { type: "all", team: "ally" })
	.setMoraleRequirement(2)
	.setScalings({ cooldownReduction: 1 })
	.setModifiers({ name: "Impact", stacks: 2 }, { name: "Regeneration", stacks: 1 });

/** @type {typeof soothingSandstormFormation.effect} */
function soothingSandstormFormationEffect(targets, user, adventure) {
	const { essence, moraleRequirement, scalings: { cooldownReduction }, modifiers: [impact, regeneration] } = module.exports;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const hadCooldowns = [];
	for (const target of targets) {
		let didCooldown = false;
		target.gear?.forEach(gear => {
			if (gear.cooldown > 1) {
				didCooldown = true;
				gear.cooldown -= cooldownReduction;
			}
		})
		if (didCooldown) {
			hadCooldowns.push(target.name);
		}
	}
	const results = [];
	if (hadCooldowns.length > 0) {
		results.push(`${listifyEN(hadCooldowns)} had their cooldowns hastened.`);
	}
	if (user.crit) {
		results.push(...addModifier(targets, impact));
	}
	results.push(...addModifier(targets, regeneration));
	return results;
}
//#endregion Soothing

module.exports = new GearFamily(sandstormFormation, [balancedSandstormFormation, soothingSandstormFormation], false);
