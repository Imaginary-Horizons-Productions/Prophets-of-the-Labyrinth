const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Strength Spinach",
	"Grants the user 50 @e{Power Up}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, adventure) => {
		return generateModifierResultLines(addModifier([user], { name: "Power Up", stacks: 50 }));
	}
).setFlavorText({ name: "*Additional Notes*", value: "*It does what it says on the tin.*" });
