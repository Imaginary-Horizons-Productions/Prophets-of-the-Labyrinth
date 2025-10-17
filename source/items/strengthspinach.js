const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Strength Spinach",
	"Grants the user 50 @e{Empowerment}",
	"Unaligned",
	30,
	selectSelf,
	(targets, user, adventure) => {
		return addModifier([user], { name: "Empowerment", stacks: 50 });
	}
).setFlavorText({ name: "*Additional Notes*", value: "*It does what it says on the tin.*" });
