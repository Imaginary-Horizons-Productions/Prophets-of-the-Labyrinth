const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Finesse Fiber",
	"Grants the user 2 @e{Finesse}",
	"Unaligned",
	30,
	selectSelf,
	(targets, user, adventure) => {
		return addModifier([user], { name: "Finesse", stacks: 2 });
	}
);
