const { GearTemplate, GearFamily } = require('../classes/index.js');
const { getModifierCategory } = require('../modifiers/_modifierDictionary.js');
const { removeModifier, changeStagger, combineModifierReceipts, generateModifierResultLines, addModifier } = require('../util/combatantUtil.js');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');

//#region Base
const medicsKit = new GearTemplate("Medic's Kit",
	[
		["use", "Cure @{debuffsCured} random debuff from each ally"],
		["critical", "Increase the party's morale by @{morale}"]
	],
	"Support",
	"Water"
).setCost(200)
	.setEffect(medicsKitEffect, { type: "all", team: "ally" })
	.setUpgrades("Cleansing Medic's Kit", "Warning Medic's Kit")
	.setCooldown(2)
	.setScalings({
		debuffsCured: 1,
		morale: 1
	})
	.setRnConfig({ debuffs: 1 });

/** @type {typeof medicsKit.effect} */
function medicsKitEffect(targets, user, adventure) {
	const { essence, scalings: { debuffsCured, morale } } = medicsKit;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const receipts = [];
	for (const target of targets) {
		const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		const debuffsToRemove = Math.min(targetDebuffs.length, debuffsCured);
		for (let i = 0; i < debuffsToRemove; i++) {
			const [rolledDebuff] = targetDebuffs.splice(user.roundRns[`${medicsKit.name}${SAFE_DELIMITER}debuffs`][i] % targetDebuffs.length, 1);
			receipts.push(...removeModifier([target], { name: rolledDebuff, stacks: "all" }));
		}
	}
	const resultLines = generateModifierResultLines(combineModifierReceipts(receipts));
	if (user.crit) {
		adventure.room.morale += morale;
		resultLines.push("The party's morale is increased!");
	}
	return resultLines;
}
//#endregion Base

//#region Cleansing
const cleansingMedicsKit = new GearTemplate("Cleansing Medic's Kit",
	[
		["use", "Cure @{debuffsCured} random debuffs from each ally"],
		["critical", "Increase the party's morale by @{morale}"]
	],
	"Support",
	"Water"
).setCost(350)
	.setEffect(cleansingMedicsKitEffect, { type: "all", team: "ally" })
	.setCooldown(2)
	.setRnConfig({ debuffs: 2 })
	.setScalings({
		debuffsCured: 2,
		morale: 1
	});

/** @type {typeof cleansingMedicsKit.effect} */
function cleansingMedicsKitEffect(targets, user, adventure) {
	const { essence, scalings: { debuffsCured, morale } } = cleansingMedicsKit;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const receipts = [];
	for (const target of targets) {
		const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		const debuffsToRemove = Math.min(targetDebuffs.length, debuffsCured);
		for (let i = 0; i < debuffsToRemove; i++) {
			const [rolledDebuff] = targetDebuffs.splice(user.roundRns[`${cleansingMedicsKit.name}${SAFE_DELIMITER}debuffs`][i] % targetDebuffs.length, 1);
			receipts.push(...removeModifier([target], { name: rolledDebuff, stacks: "all" }));
		}
	}
	const resultLines = generateModifierResultLines(combineModifierReceipts(receipts));
	if (user.crit) {
		adventure.room.morale += morale;
		resultLines.push("The party's morale is increased!");
	}
	return resultLines;
}
//#endregion Cleansing

//#region Warning
const warningMedicsKit = new GearTemplate("Warning Medic's Kit",
	[
		["use", "Cure @{debuffsCured} random debuff and grant @{mod0Stacks} @{mod0} to each ally"],
		["critical", "Increase the party's morale by @{morale}"]
	],
	"Support",
	"Water"
).setCost(350)
	.setEffect(warningMedicsKitEffect, { type: "all", team: "ally" })
	.setCooldown(2)
	.setScalings({
		debuffsCured: 1,
		morale: 1
	})
	.setRnConfig({ debuffs: 1 })
	.setModifiers({ name: "Evasion", stacks: 1 });

/** @type {typeof warningMedicsKit.effect} */
function warningMedicsKitEffect(targets, user, adventure) {
	const { essence, scalings: { debuffsCured, morale }, modifiers: [evasion] } = warningMedicsKit;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const receipts = addModifier(targets, evasion);
	for (const target of targets) {
		const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		const debuffsToRemove = Math.min(targetDebuffs.length, debuffsCured);
		for (let i = 0; i < debuffsToRemove; i++) {
			const [rolledDebuff] = targetDebuffs.splice(user.roundRns[`${warningMedicsKit.name}${SAFE_DELIMITER}debuffs`][i] % targetDebuffs.length, 1);
			receipts.push(...removeModifier([target], { name: rolledDebuff, stacks: "all" }));
		}
	}
	const resultLines = generateModifierResultLines(combineModifierReceipts(receipts));
	if (user.crit) {
		adventure.room.morale += morale;
		resultLines.push("The party's morale is increased!");
	}
	return resultLines;
}
//#endregion Warning

module.exports = new GearFamily(medicsKit, [cleansingMedicsKit, warningMedicsKit], false);
