const { GearTemplate } = require('../classes/index.js');
const { getModifierCategory } = require('../modifiers/_modifierDictionary.js');
const { removeModifier, changeStagger, combineModifierReceipts, generateModifierResultLines, addModifier } = require('../util/combatantUtil.js');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');

const variantName = "Warning Medic's Kit";
module.exports = new GearTemplate(variantName,
	[
		["use", "Cure @{debuffsCured} random debuff and grant @{mod0Stacks} @{mod0} to each ally"],
		["Critical💥", "Increase the party's morale by @{morale}"]
	],
	"Support",
	"Water"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { debuffsCured, morale }, modifiers: [evasion] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const receipts = addModifier(targets, evasion);
		for (const target of targets) {
			const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
			const debuffsToRemove = Math.min(targetDebuffs.length, debuffsCured);
			for (let i = 0; i < debuffsToRemove; i++) {
				const [rolledDebuff] = targetDebuffs.splice(user.roundRns[`${variantName}${SAFE_DELIMITER}debuffs`][i] % targetDebuffs.length, 1);
				receipts.push(...removeModifier([target], { name: rolledDebuff, stacks: "all" }));
			}
		}
		const resultLines = generateModifierResultLines(combineModifierReceipts(receipts));
		if (user.crit) {
			adventure.room.morale += morale;
			resultLines.push("The party's morale is increased!");
		}
		return resultLines;
	}, { type: "all", team: "ally" })
	.setSidegrades("Cleansing Medic's Kit")
	.setCooldown(2)
	.setScalings({
		debuffsCured: 1,
		morale: 1
	})
	.setRnConfig({ debuffs: 1 })
	.setModifiers({ name: "Evasion", stacks: 1 });
