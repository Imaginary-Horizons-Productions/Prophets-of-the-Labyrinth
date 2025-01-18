const { GearTemplate } = require('../classes/index.js');
const { getModifierCategory } = require('../modifiers/_modifierDictionary.js');
const { removeModifier, changeStagger, combineModifierReceipts, generateModifierResultLines } = require('../util/combatantUtil.js');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');

const gearName = "Inspiring Medic's Kit";
module.exports = new GearTemplate(gearName,
	[
		["use", "Cure @{debuffsCured} random debuff from each ally and increase the party's morale by @{morale}"],
		["Critical💥", "Debuffs cured x @{critBonus}"]
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
				const debuffIndex = user.roundRns[`${gearName}${SAFE_DELIMITER}debuffs`][0] % targetDebuffs.length;
				const rolledDebuff = targetDebuffs[debuffIndex];
				const [removalReceipt] = removeModifier([target], { name: rolledDebuff, stacks: "all" });
				receipts.push(removalReceipt);
				if (removalReceipt.succeeded.size > 0) {
					targetDebuffs.splice(debuffIndex, 1);
				}
			}
		}
		adventure.room.morale += morale;
		return generateModifierResultLines(combineModifierReceipts(receipts)).concat("The party's morale is increased!");
	}, { type: "all", team: "ally" })
	.setSidegrades("Warning Medic's Kit")
	.setCooldown(2)
	.setRnConfig({ debuffs: 2 })
	.setScalings({
		debuffsCured: 1,
		critBonus: 2,
		morale: 1
	});
