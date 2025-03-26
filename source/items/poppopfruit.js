const { ItemTemplate } = require("../classes");
const { selectAllFoes } = require("../shared/actionComponents");
const { addModifier, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Pop-pop Fruit",
	"Grants 1 @e{Distraction} on all foes",
	"Unaligned",
	30,
	selectAllFoes,
	(targets, user, adventure) => {
		return generateModifierResultLines(addModifier(targets, { name: "Distraction", stacks: 1 }));
	}
);
