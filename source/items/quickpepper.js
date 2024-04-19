const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, getNames } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Quick Pepper",
	"Grants the user 3 Quicken",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		const addedQuicken = addModifier([user], { name: "Quicken", stacks: 3 }).length > 0;
		if (addedQuicken) {
			return `${getNames([user], adventure)[0]} gains Quicken.`;
		} else {
			return "But nothing happened.";
		}
	}
);
