const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addModifier } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

//#region Base
const bonfireFormation = new GearTemplate("Bonfire Formation",
	[
		["use", "Grant all allies @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["critical", "@{mod0} and @{mod1} + @{critBonus}"]
	],
	"Maneuver",
	"Fire"
).setCost(200)
	.setEffect(bonfireFormationEffect, { type: "all", team: "ally" })
	.setMoraleRequirement(1)
	.setModifiers({ name: "Excellence", stacks: 2 }, { name: "Attunement", stacks: 2 })
	.setScalings({
		critBonus: 1
	});

/** @type {typeof bonfireFormation.effect} */
function bonfireFormationEffect(targets, user, adventure) {
	const { essence, moraleRequirement, modifiers: [excellence, attunement], scalings: { critBonus } } = bonfireFormation;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingExcellence = { ...excellence };
	const pendingAttunement = { ...attunement };
	if (user.crit) {
		excellence.stacks += critBonus;
		attunement.stacks += critBonus;
	}
	return addModifier(targets, pendingExcellence).concat(addModifier(targets, pendingAttunement));
}
//#endregion Base

//#region Charging
const chargingBonfireFormation = new GearTemplate("Charging Bonfire Formation",
	[
		["use", "Grant all allies @{mod0Stacks} @{mod0}, @{mod1Stacks} @{mod1}, and @{mod2Stacks} @{mod2}"],
		["critical", "@{mod0} and @{mod1} + @{critBonus}"]
	],
	"Maneuver",
	"Fire"
).setCost(350)
	.setEffect(chargingBonfireFormationEffect, { type: "all", team: "ally" })
	.setMoraleRequirement(1)
	.setModifiers({ name: "Excellence", stacks: 2 }, { name: "Attunement", stacks: 2 }, { name: "Empowerment", stacks: 25 })
	.setScalings({
		critBonus: 1
	});

/** @type {typeof chargingBonfireFormation.effect} */
function chargingBonfireFormationEffect(targets, user, adventure) {
	const { essence, moraleRequirement, modifiers: [excellence, attunement, empowerment], scalings: { critBonus } } = chargingBonfireFormation;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingExcellence = { ...excellence };
	const pendingAttunement = { ...attunement };
	if (user.crit) {
		excellence.stacks += critBonus;
		attunement.stacks += critBonus;
	}
	return addModifier(targets, pendingExcellence).concat(addModifier(targets, pendingAttunement), addModifier(targets, empowerment));
}
//#endregion Charging

//#region Hastening
const hasteningBonfireFormation = new GearTemplate("Hastening Bonfire Formation",
	[
		["use", "Grant all allies @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["critical", "@{mod0} and @{mod1} + @{critBonus}, reduce ally cooldowns by @{cooldownReduction}"]
	],
	"Maneuver",
	"Fire"
).setCost(350)
	.setEffect(hasteningBonfireFormationEffect, { type: "all", team: "ally" })
	.setMoraleRequirement(1)
	.setModifiers({ name: "Excellence", stacks: 2 }, { name: "Attunement", stacks: 2 })
	.setScalings({
		critBonus: 1,
		cooldownReduction: 1
	});

/** @type {typeof hasteningBonfireFormation.effect} */
function hasteningBonfireFormationEffect(targets, user, adventure) {
	const { essence, moraleRequirement, modifiers: [excellence, attunement], scalings: { critBonus, cooldownReduction } } = hasteningBonfireFormation;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingExcellence = { ...excellence };
	const pendingAttunement = { ...attunement };
	const resultLines = [];
	if (user.crit) {
		excellence.stacks += critBonus;
		attunement.stacks += critBonus;
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
		resultLines.push(`${listifyEN(hadCooldowns)} had their cooldowns hastened.`);
	}
	return addModifier(targets, pendingExcellence).concat(addModifier(targets, pendingAttunement), resultLines);
}
//#endregion Hastening

module.exports = new GearFamily(bonfireFormation, [chargingBonfireFormation, hasteningBonfireFormation], false);
