const { ItemTemplate } = require("../classes");
const { isDebuff } = require("../modifiers/_modifierDictionary");
const { removeModifier, getNames } = require("../util/combatantUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new ItemTemplate("Panacea",
	"Cure the user of up to 2 random debuffs",
	"Untyped",
	30,
	(self, adventure) => {
		return [[self.team, adventure.getCombatantIndex(self)]];
	},
	false,
	(targets, user, isCrit, adventure) => {
		const removedDebuffs = [];
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		const debuffsToRemove = Math.min(userDebuffs.length, 2);
		for (let i = 0; i < debuffsToRemove; i++) {
			const debuffIndex = adventure.generateRandomNumber(userDebuffs.length, "battle");
			const rolledDebuff = userDebuffs[debuffIndex];
			const wasRemoved = removeModifier([user], { name: rolledDebuff, stacks: "all" }).length > 0;
			if (wasRemoved) {
				removedDebuffs.push(rolledDebuff);
				userDebuffs.splice(debuffIndex, 1);
			}
		}

		if (removedDebuffs.length > 1) {
			return `${getNames([user], adventure)[0]} is cured of ${listifyEN(removedDebuffs)}.`;
		} else {
			return "But nothing happened.";
		}
	}
);
