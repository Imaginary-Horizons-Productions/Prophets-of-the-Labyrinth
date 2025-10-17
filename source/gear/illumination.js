const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addModifier } = require('../util/combatantUtil');

//#region Base
const illumination = new GearTemplate("Illumination",
	[
		["use", "Reduce an ally's cooldowns by @{cooldownReduction}"],
		["critical", "Increase the party's morale by @{morale}"]
	],
	"Spell",
	"Light"
).setCost(200)
	.setEffect(illuminationEffect, { type: "single", team: "ally" })
	.setCharges(15)
	.setScalings({
		cooldownReduction: 1,
		morale: 1
	});

/** @type {typeof illumination.effect} */
function illuminationEffect(targets, user, adventure) {
	const { essence, scalings: { cooldownReduction, morale } } = illumination;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const results = [];
	for (const target of targets) {
		let didCooldown = false;
		target.gear?.forEach(gear => {
			if (gear.cooldown > 1) {
				didCooldown = true;
				gear.cooldown -= cooldownReduction;
			}
		})
		if (didCooldown) {
			results.push(`${target.name} had their cooldowns hastened.`);
		}
	}
	if (user.crit) {
		adventure.room.morale += morale;
		results.push("The party's morale is increased!");
	}
	return results;
}
//#endregion Base

//#region Balanced
const balancedIllumination = new GearTemplate("Balanced Illumination",
	[
		["use", "Reduce an ally's cooldowns by @{cooldownReduction} and grant them @{mod0Stacks} @{mod0}"],
		["critical", "Increase the party's morale by @{morale}"]
	],
	"Spell",
	"Light"
).setCost(350)
	.setEffect(balancedIlluminationEffect, { type: "single", team: "ally" })
	.setCharges(15)
	.setScalings({
		cooldownReduction: 1,
		morale: 1
	})
	.setModifiers({ name: "Finesse", stacks: 1 });

/** @type {typeof balancedIllumination.effect} */
function balancedIlluminationEffect(targets, user, adventure) {
	const { essence, scalings: { cooldownReduction, morale }, modifiers: [finesse] } = balancedIllumination;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const results = [];
	for (const target of targets) {
		let didCooldown = false;
		target.gear?.forEach(gear => {
			if (gear.cooldown > 1) {
				didCooldown = true;
				gear.cooldown -= cooldownReduction;
			}
		})
		if (didCooldown) {
			results.push(`${target.name} had their cooldowns hastened.`);
		}
	}
	if (user.crit) {
		adventure.room.morale += morale;
		results.push("The party's morale is increased!");
	}
	return results.concat(addModifier(targets, finesse));
}
//#endregion Balanced

//#region Inspiring
const inspiringIllumination = new GearTemplate("Inspiring Illumination",
	[
		["use", "Reduce an ally's cooldowns by @{cooldownReduction} and increase the party's morale by @{baseMorale}"],
		["critical", "Increase the party's morale by @{critMorale}"]
	],
	"Spell",
	"Light"
).setCost(350)
	.setEffect(inspiringIlluminationEffect, { type: "single", team: "ally" })
	.setCharges(15)
	.setScalings({
		cooldownReduction: 1,
		baseMorale: 1,
		critMorale: 1
	});

/** @type {typeof inspiringIllumination.effect} */
function inspiringIlluminationEffect(targets, user, adventure) {
	const { essence, scalings: { cooldownReduction, baseMorale, critMorale } } = inspiringIllumination;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const results = [];
	for (const target of targets) {
		let didCooldown = false;
		target.gear?.forEach(gear => {
			if (gear.cooldown > 1) {
				didCooldown = true;
				gear.cooldown -= cooldownReduction;
			}
		})
		if (didCooldown) {
			results.push(`${target.name} had their cooldowns hastened.`);
		}
	}
	if (user.crit) {
		adventure.room.morale += critMorale;
	}
	adventure.room.morale += baseMorale;
	results.push("The party's morale is increased!");
	return results;
}
//#endregion Inspiring

module.exports = new GearFamily(illumination, [balancedIllumination, inspiringIllumination], false);
