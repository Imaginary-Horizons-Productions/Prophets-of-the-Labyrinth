const { ItemTemplate } = require("../classes");
const { getGearProperty } = require("../gear/_gearDictionary");
const { selectSelf } = require("../shared/actionComponents");

module.exports = new ItemTemplate("Spellbook Repair Kit",
	"Restore all charges to the user's Spells",
	"Untyped",
	30,
	selectSelf,
	(targets, user, adventure) => {
		user.gear.forEach((gear) => {
			/** @type {number} */
			const maxCharges = getGearProperty(gear.name, "maxCharges");
			if (maxCharges > 0 && gear.charges < maxCharges) {
				gear.charges = maxCharges;
			}
		})

		return ["All their Spells regain charges."];
	}
).setFlavorText({ name: "*Additional Notes*", value: "*It's a bit rusty...*" });
