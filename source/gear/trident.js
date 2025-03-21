const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, dealDamage, generateModifierResultLines, removeModifier } = require('../util/combatantUtil');
const { damageScalingGenerator, kineticDamageScalingGenerator } = require('./shared/scalings');

//#region Base
const trident = new GearTemplate("Trident",
	[
		["use", "Inflict <@{damage}> @{essence} damage on a foe, then shrug off @{debuffsCured} random debuff"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Water"
).setCost(200)
	.setEffect(tridentEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		debuffsCured: 1
	})
	.setRnConfig({ debuffs: 1 });

/** @type {typeof trident.effect} */
function tridentEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus } } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
	return resultLines.concat(generateModifierResultLines(removeModifier([user], { name: userDebuffs[user.roundRns[`${trident.name}${SAFE_DELIMITER}debuffs`][0] % userDebuffs.length], stacks: "all" })));
}
//#endregion Base

//#region Kinetic
const kineticTrident = new GearTemplate("Kinetic Trident",
	[
		["use", "Inflict <@{damage}> @{essence} damage on a foe, then shrug off @{debuffsCured} random debuff"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Water"
).setCost(350)
	.setEffect(kineticTridentEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({
		damage: kineticDamageScalingGenerator(40),
		critBonus: 2,
		debuffsCured: 1
	})
	.setRnConfig({ debuffs: 1 });

/** @type {typeof kineticTrident.effect} */
function kineticTridentEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus } } = kineticTrident;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
	return resultLines.concat(generateModifierResultLines(removeModifier([user], { name: userDebuffs[user.roundRns[`${kineticTrident.name}${SAFE_DELIMITER}debuffs`][0] % userDebuffs.length], stacks: "all" })));
}
//#endregion Kinetic

//#region Staggering
const staggeringTrident = new GearTemplate("Staggering Trident",
	[
		["use", "Inflict <@{damage}> @{essence} damage on a foe, then shrug off @{debuffsCured} random debuff"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Water"
).setCost(350)
	.setEffect(staggeringTridentEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		debuffsCured: 1
	})
	.setRnConfig({ debuffs: 1 })
	.setStagger(2);

/** @type {typeof staggeringTrident.effect} */
function staggeringTridentEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, stagger } = staggeringTrident;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (survivors.length > 0) {
		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		changeStagger(survivors, user, pendingStagger);
	}
	const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
	return resultLines.concat(generateModifierResultLines(removeModifier([user], { name: userDebuffs[user.roundRns[`${staggeringTrident.name}${SAFE_DELIMITER}debuffs`][0] % userDebuffs.length], stacks: "all" })));
}
//#endregion Staggering

module.exports = new GearFamily(trident, [kineticTrident, staggeringTrident], false);
