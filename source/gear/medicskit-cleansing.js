const { GearTemplate } = require('../classes/index.js');
const { getModifierCategory } = require('../modifiers/_modifierDictionary.js');
const { removeModifier, changeStagger, combineModifierReceipts, generateModifierResultLines } = require('../util/combatantUtil.js');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');

const variantName = "Cleansing Medic's Kit";
module.exports = new GearTemplate(variantName,
	[
		["use", "Cure @{debuffsCured} random debuffs from each ally"],
		["Critical💥", "Increase the party's morale by @{morale}"]
	],
	"Support",
	"Water"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { debuffsCured, critBonus, morale } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const receipts = [];
		for (const target of targets) {
			const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
			const debuffsToRemove = Math.min(targetDebuffs.length, user.crit ? debuffsCured * critBonus : debuffsCured);
			for (let i = 0; i < debuffsToRemove; i++) {
				const debuffIndex = user.roundRns[`${variantName}${SAFE_DELIMITER}debuffs`][0] % targetDebuffs.length;
				const rolledDebuff = targetDebuffs[debuffIndex];
				const [removalReceipt] = removeModifier([target], { name: rolledDebuff, stacks: "all" });
				receipts.push(removalReceipt);
				if (removalReceipt.succeeded.size > 0) {
					targetDebuffs.splice(debuffIndex, 1);
				}
			}
		}
		const resultLines = generateModifierResultLines(combineModifierReceipts(receipts));
		if (user.crit) {
			adventure.room.morale += morale;
			resultLines.push("The party's morale is increased!");
		}
		return resultLines;
	}, { type: "all", team: "ally" })
	.setSidegrades("Warning Medic's Kit")
	.setCooldown(2)
	.setRnConfig({ debuffs: 2 })
	.setScalings({
		debuffsCured: 2,
		morale: 1
	});
