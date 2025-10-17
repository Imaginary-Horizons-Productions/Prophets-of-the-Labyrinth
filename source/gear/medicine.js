const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, removeModifier } = require('../util/combatantUtil');

//#region Base
const medicine = new GearTemplate("Medicine",
	[
		["use", "Cure @{debuffsCured} random debuff on an ally"],
		["critical", "Debuffs cured x @{critBonus}"]
	],
	"Spell",
	"Earth"
).setCost(200)
	.setEffect(medicineEffect, { type: "single", team: "ally" })
	.setCharges(15)
	.setScalings({
		debuffsCured: 1,
		critBonus: 2
	})
	.setRnConfig({ Medicine: 2 });

/** @type {typeof medicine.effect} */
function medicineEffect([target], user, adventure) {
	const { essence, scalings: { debuffsCured, critBonus } } = medicine;
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	let pendingCures = debuffsCured;
	if (user.crit) {
		pendingCures *= critBonus;
	}
	const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
	const results = [];
	for (let i = 0; i < pendingCures; i++) {
		const [rolledDebuff] = targetDebuffs.splice(user.roundRns[`${medicine.name}${SAFE_DELIMITER}Medicine`][i] % targetDebuffs.length, 1);
		results.push(...removeModifier([target], { name: rolledDebuff, stacks: "all" }));
	}
	return results;
}
//#endregion Base

//#region Hastening
const hasteningMedicine = new GearTemplate("Hastening Medicine",
	[
		["use", "Cure @{debuffsCured} random debuff on an ally"],
		["critical", "Debuffs cured x @{critBonus}, reduce the target's cooldowns by @{cooldownReduction}"]
	],
	"Spell",
	"Earth"
).setCost(350)
	.setEffect(hasteningMedicineEffect, { type: "single", team: "ally" })
	.setCharges(15)
	.setScalings({
		debuffsCured: 1,
		critBonus: 2,
		cooldownReduction: 1
	})
	.setRnConfig({ Medicine: 2 });

/** @type {typeof hasteningMedicine.effect} */
function hasteningMedicineEffect([target], user, adventure) {
	const { essence, scalings: { debuffsCured, critBonus, cooldownReduction } } = hasteningMedicine;
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	let pendingCures = debuffsCured;
	const results = [];
	if (user.crit) {
		pendingCures *= critBonus;
		let didCooldown = false;
		target.gear?.forEach(gear => {
			if (gear.cooldown > 1) {
				didCooldown = true;
				gear.cooldown -= cooldownReduction;
			}
		})
		if (didCooldown) {
			results.push(`${target.name}'s cooldowns were hastened.`);
		}
	}
	const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
	for (let i = 0; i < pendingCures; i++) {
		const [selectedDebuff] = targetDebuffs.splice(user.roundRns[`${hasteningMedicine.name}${SAFE_DELIMITER}Medicine`][i] % targetDebuffs.length, 1);
		results.push(...removeModifier([target], { name: selectedDebuff, stacks: "all" }));
	}
	return results;
}
//#endregion Hastening

//#region Urgent
const urgentMedicine = new GearTemplate("Urgent Medicine",
	[
		["use", "Cure @{debuffsCured} random debuff on an ally with priority"],
		["critical", "Debuffs cured x @{critBonus}"]
	],
	"Spell",
	"Earth"
).setCost(350)
	.setEffect(medicineEffect, { type: "single", team: "ally" })
	.setCharges(15)
	.setScalings({
		debuffsCured: 1,
		critBonus: 2,
		priority: 1
	})
	.setRnConfig({ Medicine: 2 });
//#endregion Urgent

module.exports = new GearFamily(medicine, [hasteningMedicine, urgentMedicine], false);
