const { GearTemplate, GearFamily } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, dealDamage, removeModifier, addModifier } = require('../util/combatantUtil');

const bounces = 3;

//#region Base
const lightningStaff = new GearTemplate("Lightning Staff",
	[
		["use", "Strike @{bounces} random foes for <@{damage}> @{essence} damage"],
		["critical", "Damage x @{critBonus}"]
	],
	"Adventuring",
	"Wind"
).setCost(200)
	.setEffect(lightningStaffEffect, { type: `random${SAFE_DELIMITER}${bounces}`, team: "foe" })
	.setCooldown(2)
	.setScalings({
		damage: { description: "50% Power", calculate: (user) => Math.floor(user.getPower() / 2) },
		critBonus: 2,
		bounces
	})
	.setRnConfig({ foes: 3 });

/** @type {typeof lightningStaff.effect} */
function lightningStaffEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus } } = lightningStaff;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return results;
}
//#endregion Base

//#region Disenchanting
const disenchantingLightningStaff = new GearTemplate("Disenchanting Lightning Staff",
	[
		["use", "Deal <@{damage}> @{essence} damage and remove @{buffRemovals} random buff from @{bounces} random foes"],
		["critical", "Damage x @{critBonus}"]
	],
	"Adventuring",
	"Wind"
).setCost(350)
	.setEffect(disenchantingLightningStaffEffect, { type: `random${SAFE_DELIMITER}${bounces}`, team: "foe" })
	.setCooldown(2)
	.setRnConfig({ foes: 3, buffs: 1 })
	.setScalings({
		damage: { description: "50% Power", calculate: (user) => Math.floor(user.getPower() / 2) },
		critBonus: 2,
		buffRemovals: 1,
		bounces
	});

/** @type {typeof disenchantingLightningStaff.effect} */
function disenchantingLightningStaffEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, buffRemovals } } = disenchantingLightningStaff;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	for (const target of survivors) {
		const targetBuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
		if (targetBuffs.length > 0) {
			for (let i = 0; i < buffRemovals; i++) {
				const [selectedBuff] = targetBuffs.splice(user.roundRns(`${disenchantingLightningStaff.name}${SAFE_DELIMITER}buffs`), 1);
				results.push(...removeModifier([target], { name: selectedBuff, stacks: "all" }));
			}
		}
	}
	return results;
}
//#endregion Disenchanting

//#region Hexing
const hexingLightningStaff = new GearTemplate("Hexing Lightning Staff",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on @{bounces} random foes"],
		["critical", "Damage x @{critBonus}"]
	],
	"Adventuring",
	"Wind"
).setCost(350)
	.setEffect(hexingLightningStaffEffect, { type: `random${SAFE_DELIMITER}${bounces}`, team: "foe" })
	.setCooldown(2)
	.setRnConfig({ foes: 3 })
	.setScalings({
		damage: { description: "50% Power", calculate: (user) => Math.floor(user.getPower() / 2) },
		critBonus: 2,
		bounces
	})
	.setModifiers({ name: "Misfortune", stacks: 4 });

/** @type {typeof hexingLightningStaff.effect} */
function hexingLightningStaffEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [misfortune] } = hexingLightningStaff;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { results, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return results.concat(addModifier(survivors, misfortune));
}
//#endregion Hexing

module.exports = new GearFamily(lightningStaff, [disenchantingLightningStaff, hexingLightningStaff], false);
