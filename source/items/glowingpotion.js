const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Glowing Potion",
	"Grants the user 3 @e{Light Absorb}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, adventure) => {
		return generateModifierResultLines(addModifier([user], { name: "Light Absorb", stacks: 3 }));
	}
);
