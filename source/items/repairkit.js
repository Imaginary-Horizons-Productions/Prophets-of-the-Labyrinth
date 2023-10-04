const { ItemTemplate } = require("../classes");
const { getGearProperty } = require("../gear/_gearDictionary");
const { selectSelf } = require("../shared/actionComponents");

module.exports = new ItemTemplate("Repair Kit",
	"Repairs all the user's gear by 25% of its max durability",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		user.gear.forEach((gear) => {
			/** @type {number} */
			const maxDurability = getGearProperty(gear.name, "maxDurability");
			if (maxDurability > 0 && gear.durability < maxDurability) {
				gear.durability = Math.min(gear.durability + Math.ceil(maxDurability / 4), maxDurability);
			}
		})

		return "All their gear regains some durability.";
	}
).setFlavorText({ name: "*Additional Notes*", value: "*It's a bit rusty...*" });
