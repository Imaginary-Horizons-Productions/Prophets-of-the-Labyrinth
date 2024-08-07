const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, getNames } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ItemTemplate("Inky Potion",
	"Grants the user 3 Darkness Absorb",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		const addedAbsorb = addModifier([user], { name: "Darkness Absorb", stacks: 3 }).length > 0;
		if (addedAbsorb) {
			return `${getNames([user], adventure)[0]} now absorbs ${getEmoji("Darkness")} damage.`;
		} else {
			return "But nothing happened.";
		}
	}
);
