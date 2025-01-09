const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Creative Acorn",
	"Grants the user 15 @e{Fortune}",
	"Unaligned",
	30,
	selectSelf,
	(targets, user, adventure) => {
		return generateModifierResultLines(addModifier([user], { name: "Fortune", stacks: 15 }));
	}
);
