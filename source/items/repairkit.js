const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
// const { getEquipmentProperty } = require("../equipment/_equipmentDictionary.js");

module.exports = new ItemTemplate("Repair Kit",
	"Repairs all the user's gear by 25% of its max durability",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		user.equipment.forEach((equip) => {
			const maxUses = getEquipmentProperty(equip.name, "maxUses");
			if (maxUses > 0 && equip.uses < maxUses) {
				equip.uses = Math.min(equip.uses + Math.ceil(maxUses / 4), maxUses);
			}
		})

		return "All their gear regains some durability.";
	}
);
