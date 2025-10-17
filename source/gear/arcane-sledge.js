const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, removeModifier, dealDamage, addModifier } = require('../util/combatantUtil');
const { scalingImpotence } = require('./shared/modifiers');
const { kineticDamageScalingGenerator, damageScalingGenerator } = require('./shared/scalings');

//#region Base
const arcaneSledge = new GearTemplate("Arcane Sledge",
	[
		["use", "Deal <@{damage}> @{essence} damage and remove @{buffsRemoved} random buff from a foe"],
		["critical", "Buffs removed x @{critBonus}"]
	],
	"Support",
	"Wind"
).setCost(200)
	.setEffect(arcaneSledgeEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		buffsRemoved: 1,
		critBonus: 2
	})
	.setRnConfig({ buffs: 2 });

/** @type {typeof arcaneSledge.effect} */
function arcaneSledgeEffect(targets, user, adventure) {
	const { essence, scalings: { damage, buffsRemoved, critBonus } } = arcaneSledge;
	const { results, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (survivors.length > 0) {
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingBuffRemovals = buffsRemoved;
		if (user.crit) {
			pendingBuffRemovals *= critBonus;
		}
		const targetBuffs = Object.keys(survivors[0].modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
		if (targetBuffs.length > 0) {
			for (let i = 0; i < pendingBuffRemovals; i++) {
				const [selectedBuff] = targetBuffs.splice(user.roundRns(`${arcaneSledge.name}${SAFE_DELIMITER}buffs`), 1);
				results.push(...removeModifier(survivors, { name: selectedBuff, stacks: "all" }));
			}
		}
	}
	return results;
}
//#endregion Base

//#region Fatiguing
const fatiguingArcaneSledge = new GearTemplate("Fatiguing Arcane Sledge",
	[
		["use", "Deal <@{damage}> @{essence} damage, inflict @{mod0Stacks} @{mod0}, and remove @{buffsRemoved} random buff from a foe"],
		["critical", "Buffs removed x @{critBonus}"]
	],
	"Support",
	"Wind"
).setCost(350)
	.setEffect(fatiguingArcaneSledgeEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		buffsRemoved: 1,
		critBonus: 2
	})
	.setRnConfig({ buffs: 2 })
	.setModifiers(scalingImpotence(2));

/** @type {typeof fatiguingArcaneSledge.effect} */
function fatiguingArcaneSledgeEffect(targets, user, adventure) {
	const { essence, modifiers: [impotence], scalings: { damage, buffsRemoved, critBonus } } = fatiguingArcaneSledge;
	const { results, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (survivors.length > 0) {
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingBuffRemovals = buffsRemoved;
		if (user.crit) {
			pendingBuffRemovals *= critBonus;
		}
		const targetBuffs = Object.keys(survivors[0].modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
		results.push(...addModifier(survivors, { name: impotence.name, stacks: impotence.stacks.calculate(user) }));
		if (targetBuffs.length > 0) {
			for (let i = 0; i < pendingBuffRemovals; i++) {
				const [selectedBuff] = targetBuffs.splice(user.roundRns(`${fatiguingArcaneSledge.name}${SAFE_DELIMITER}buffs`), 1);
				results.push(...removeModifier(survivors, { name: selectedBuff, stacks: "all" }));
			}
		}
	}
	return results;
}
//#endregion Fatiguing

//#region Kinetic
const kineticArcaneSledge = new GearTemplate("Kinetic Arcane Sledge",
	[
		["use", "Deal <@{damage}> @{essence} damage and remove @{buffsRemoved} random buff from a foe"],
		["critical", "Buffs removed x @{critBonus}"]
	],
	"Support",
	"Wind"
).setCost(350)
	.setEffect(kineticArcaneSledgeEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setScalings({
		damage: kineticDamageScalingGenerator(40),
		buffsRemoved: 1,
		critBonus: 2
	})
	.setRnConfig({ buffs: 2 });

/** @type {typeof kineticArcaneSledge.effect} */
function kineticArcaneSledgeEffect(targets, user, adventure) {
	const { essence, scalings: { damage, buffsRemoved, critBonus } } = kineticArcaneSledge;
	const { results, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (survivors.length > 0) {
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingBuffRemovals = buffsRemoved;
		if (user.crit) {
			pendingBuffRemovals *= critBonus;
		}
		const targetBuffs = Object.keys(survivors[0].modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
		if (targetBuffs.length > 0) {
			for (let i = 0; i < pendingBuffRemovals; i++) {
				const [selectedBuff] = targetBuffs.splice(user.roundRns(`${kineticArcaneSledge.name}${SAFE_DELIMITER}buffs`), 1);
				results.push(...removeModifier(survivors, { name: selectedBuff, stacks: "all" }));
			}
		}
	}
	return results;
}
//#endregion Kinetic

module.exports = new GearFamily(arcaneSledge, [fatiguingArcaneSledge, kineticArcaneSledge], false);
