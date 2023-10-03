const { ItemTemplate } = require("../classes");
const { getGearProperty } = require("../gear/_gearDictionary");
const { selectSelf } = require("../shared/actionComponents");

module.exports = new ItemTemplate("Repair Kit",
	"Repairs all the user's gear by 25% of its max durability",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		user.equipment.forEach((equip) => {
			/** @type {number} */
			const maxDurability = getGearProperty(equip.name, "maxDurability");
			if (maxDurability > 0 && equip.uses < maxDurability) {
				equip.uses = Math.min(equip.uses + Math.ceil(maxDurability / 4), maxDurability);
			}
		})

		return "All their gear regains some durability.";
	}
);
