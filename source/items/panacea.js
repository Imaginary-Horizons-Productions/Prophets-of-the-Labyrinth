const { ItemTemplate } = require("../classes");
const { getModifierCategory } = require("../modifiers/_modifierDictionary");
const { removeModifier, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");
const { SAFE_DELIMITER } = require('../constants.js');

const itemName = "Panacea";
module.exports = new ItemTemplate(itemName,
	"Cure the user of up to 2 random debuffs",
	"Unaligned",
	30,
	(self, adventure) => {
		return [[self.team, adventure.getCombatantIndex(self)]];
	},
	(targets, user, adventure) => {
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		const debuffsToRemove = Math.min(userDebuffs.length, 2);
		const receipts = [];
		for (let i = 0; i < debuffsToRemove; i++) {
			const debuffIndex = user.roundRns[`${itemName}${SAFE_DELIMITER}debuffs`][i] % userDebuffs.length;
			const rolledDebuff = userDebuffs[debuffIndex];
			const [removalReceipt] = removeModifier([user], { name: rolledDebuff, stacks: "all" });
			receipts.push(removalReceipt);
			if (removalReceipt.succeeded.size > 0) {
				userDebuffs.splice(debuffIndex, 1);
			}
		}

		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
);
