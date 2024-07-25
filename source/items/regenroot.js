const { ItemTemplate } = require("../classes");
const { getModifierEmoji } = require("../modifiers/_modifierDictionary");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, getNames } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Regen Root",
	`Grants the user 5 ${getModifierEmoji("Regen")}`,
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		const addedRegen = addModifier([user], { name: "Regen", stacks: 5 }).length > 0;
		if (addedRegen) {
			return `${getNames([user], adventure)[0]} gains Regen.`;
		} else {
			return "But nothing happened.";
		}
	}
);
