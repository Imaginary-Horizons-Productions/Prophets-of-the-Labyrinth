const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Creative Acorn",
	"Grants the user 2 @e{Lucky}",
	"Untyped",
	30,
	selectSelf,
	(targets, user, adventure) => {
		return generateModifierResultLines(addModifier([user], { name: "Lucky", stacks: 2 }));
	}
);
