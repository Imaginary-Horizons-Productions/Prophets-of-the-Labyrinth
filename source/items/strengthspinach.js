const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, getNames } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Strength Spinach",
	"Grants the user 50 Power Up",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		const addedPowerUp = addModifier([user], { name: "Power Up", stacks: 50 }).length > 0;
		if (addedPowerUp) {
			return `${getNames([user], adventure)[0]} is Powered Up.`;
		} else {
			return "But nothing happened.";
		}
	}
).setFlavorText({ name: "*Additional Notes*", value: "*It does what it says on the tin.*" });
