const { ItemTemplate } = require("../classes");
const { getGearProperty } = require("../gear/_gearDictionary");
const { selectSelf } = require("../shared/actionComponents");

module.exports = new ItemTemplate("Portable Spellbook Charger",
	"Fully recharge all the user's Spells",
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

		return ["All their Spells are recharged."];
	}
).setFlavorText({ name: "*Additional Notes*", value: "*If it was a repair kit, it'd be a bit rusty...*" });
