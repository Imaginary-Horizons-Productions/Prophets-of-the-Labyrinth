const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Watery Potion",
	"Grants the user 3 @e{Water Absorb}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		return addModifier([user], { name: "Water Absorb", stacks: 3 });
	}
).setFlavorText({ name: "*Additional Note*", value: "Apply directly to the forehead." });
