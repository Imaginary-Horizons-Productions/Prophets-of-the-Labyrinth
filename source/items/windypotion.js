const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents.js");
const { addModifier } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Windy Potion",
	"Grants the user 3 @e{Wind Absorb}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		return addModifier([user], { name: "Wind Absorb", stacks: 3 });
	}
);
