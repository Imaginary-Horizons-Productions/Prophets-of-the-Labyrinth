const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Earthen Potion",
	"Grants the user 3 @e{Earth Absorption}",
	"Unaligned",
	30,
	selectSelf,
	(targets, user, adventure) => {
		return generateModifierResultLines(addModifier([user], { name: "Earth Absorption", stacks: 3 }));
	}
);
