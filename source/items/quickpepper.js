const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Quick Pepper",
	"Grants the user 3 @e{Swiftness}",
	"Unaligned",
	30,
	selectSelf,
	(targets, user, adventure) => {
		return addModifier([user], { name: "Swiftness", stacks: 3 });
	}
);
