const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addProtection, addModifier } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');
const { scalingExposure } = require('./shared/modifiers');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');

//#region Base
const enchantmentSiphon = new GearTemplate("Enchantment Siphon",
	[
		["use", "Remove a foe's protection, gain <@{protection} + removed protection> protection"],
		["critical", "Protection x @{critBonus}"]
	],
	"Defense",
	"Wind"
).setCost(200)
	.setEffect(enchantmentSiphonEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(0),
		critBonus: 2
	});

/** @type {typeof enchantmentSiphon.effect} */
function enchantmentSiphonEffect([target], user, adventure) {
	const { essence, scalings: { protection, critBonus } } = enchantmentSiphon;
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const stolenProtection = target.protection;
	target.protection = 0;
	let pendingProtection = protection.calculate(user) + stolenProtection;
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection([user], pendingProtection);
	if (stolenProtection > 0) {
		return [`${user.name} steals ${target.name}'s protection.`];
	} else {
		return [`${user.name} gains protection.`];
	}
}
//#endregion Base

//#region Flanking
const flankingEnchantmentSiphon = new GearTemplate("Flanking Enchantment Siphon",
	[
		["use", "Remove a foe's protection and inflict <@{mod0Stacks}> @{mod0} on them, gain <@{protection} + removed protection> protection"],
		["critical", "Protection x @{critBonus}"]
	],
	"Defense",
	"Wind"
).setCost(350)
	.setEffect(flankingEnchantmentSiphonEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(0),
		critBonus: 2
	})
	.setModifiers(scalingExposure(1));

/** @type {typeof flankingEnchantmentSiphon.effect} */
function flankingEnchantmentSiphonEffect([target], user, adventure) {
	const { essence, scalings: { protection, critBonus }, modifiers: [exposure] } = flankingEnchantmentSiphon;
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const stolenProtection = target.protection;
	target.protection = 0;
	let pendingProtection = protection.calculate(user) + stolenProtection;
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection([user], pendingProtection);
	const results = addModifier([target], { name: exposure.name, stacks: exposure.stacks.calculate(user) });
	if (stolenProtection > 0) {
		return [`${user.name} steals ${target.name}'s protection.`].concat(results);
	} else {
		return [`${user.name} gains protection.`].concat(results);
	}
}
//#endregion Flanking

//#region Tormenting
const tormentingEnchantmentSiphon = new GearTemplate("Tormenting Enchantment Siphon",
	[
		["use", "Remove a foe's protection and add @{debuffIncrement} stack to each of their debuffs, gain <@{protection} + removed protection> protection"],
		["critical", "Protection x @{critBonus}"]
	],
	"Defense",
	"Wind"
).setCost(350)
	.setEffect(tormentingEnchantmentSiphonEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(0),
		critBonus: 2,
		debuffIncrement: 1
	});

/** @type {typeof tormentingEnchantmentSiphon.effect} */
function tormentingEnchantmentSiphonEffect([target], user, adventure) {
	const { essence, scalings: { protection, critBonus, debuffIncrement } } = tormentingEnchantmentSiphon;
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const stolenProtection = target.protection;
	target.protection = 0;
	let pendingProtection = protection.calculate(user) + stolenProtection;
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection([user], pendingProtection);
	const receipts = [];
	for (const modifier in target.modifiers) {
		if (getModifierCategory(modifier) === "Debuff") {
			receipts.push(...addModifier([target], { name: modifier, stacks: debuffIncrement }));
		}
	}
	if (stolenProtection > 0) {
		return [`${user.name} steals ${target.name}'s protection.`, ...receipts];
	} else {
		return [`${user.name} gains protection.`, ...receipts];
	}
}
//#endregion Tormenting

module.exports = new GearFamily(enchantmentSiphon, [flankingEnchantmentSiphon, tormentingEnchantmentSiphon], false);
