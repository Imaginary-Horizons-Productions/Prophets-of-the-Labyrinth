const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, getNames } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Stasis Quartz",
	"Grants the user 1 Stasis",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		addModifier([user], { name: "Stasis", stacks: 1 });
		return `${getNames([user], adventure)[0]} enters Stasis.`;
	}
);
