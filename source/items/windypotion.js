const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents.js");
const { addModifier, getNames } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ItemTemplate("Windy Potion",
	"Grants the user 3 @e{Wind Absorb}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		const addedAbsorb = addModifier([user], { name: "Wind Absorb", stacks: 3 }).length > 0;
		if (addedAbsorb) {
			return `${getNames([user], adventure)[0]} now absorbs ${getEmoji("Wind")} damage.`;
		} else {
			return "But nothing happened.";
		}
	}
);
