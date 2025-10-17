const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents.js");
const { addModifier } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Windy Potion",
	"Grants the user 3 @e{Wind Absorption}",
	"Unaligned",
	30,
	selectSelf,
	(targets, user, adventure) => {
		return addModifier([user], { name: "Wind Absorption", stacks: 3 });
	}
);
