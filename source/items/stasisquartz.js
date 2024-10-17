const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Stasis Quartz",
	"Grants the user 1 @e{Retain}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		return generateModifierResultLines(addModifier([user], { name: "Retain", stacks: 1 }));
	}
);
