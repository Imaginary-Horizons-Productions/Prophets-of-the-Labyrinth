const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Clear Potion",
	"Grants the user 3 @e{Untyped Absorb}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		return generateModifierResultLines(addModifier([user], { name: "Untyped Absorb", stacks: 3 }));
	}
);
