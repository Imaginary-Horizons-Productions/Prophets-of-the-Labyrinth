const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Salt of Oblivion",
	"Grants the user 1 @e{Oblivious}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, adventure) => {
		return generateModifierResultLines(addModifier([user], { name: "Oblivious", stacks: 1 }));
	}
);
