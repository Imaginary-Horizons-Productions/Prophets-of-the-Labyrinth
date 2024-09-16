const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, getNames } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Salt of Oblivion",
	"Grants the user 1 @e{Oblivious}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		addModifier([user], { name: "Oblivious", stacks: 1 });
		return `${getNames([user], adventure)[0]} gains Oblivious.`;
	}
);
