const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Inky Potion",
	"Grants the user 3 @e{Darkness Absorb}",
	"Untyped",
	30,
	selectSelf,
	(targets, user, adventure) => {
		return generateModifierResultLines(addModifier([user], { name: "Darkness Absorb", stacks: 3 }));
	}
);
