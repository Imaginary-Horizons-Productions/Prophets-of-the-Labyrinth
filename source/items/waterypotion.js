const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Watery Potion",
	"Grants the user 3 @e{Water Absorption}",
	"Unaligned",
	30,
	selectSelf,
	(targets, user, adventure) => {
		return addModifier([user], { name: "Water Absorption", stacks: 3 });
	}
).setFlavorText({ name: "*Additional Note*", value: "Apply directly to the forehead." });
