const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Regen Root",
	`Grants the user 5 @e{Regeneration}`,
	"Unaligned",
	30,
	selectSelf,
	(targets, user, adventure) => {
		return generateModifierResultLines(addModifier([user], { name: "Regeneration", stacks: 5 }));
	}
);
