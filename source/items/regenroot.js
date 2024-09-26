const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Regen Root",
	`Grants the user 5 @e{Regen}`,
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		return addModifier([user], { name: "Regen", stacks: 5 });
	}
);
