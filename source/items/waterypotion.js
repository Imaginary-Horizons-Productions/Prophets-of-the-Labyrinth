const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, getNames } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ItemTemplate("Watery Potion",
	"Grants the user 3 Water Absorb",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		const addedAbsorb = addModifier([user], { name: "Water Absorb", stacks: 3 }).length > 0;
		if (addedAbsorb) {
			return `${getNames([user], adventure)[0]} now absorbs ${getEmoji("Water")} damage.`;
		} else {
			return "But nothing happened.";
		}
	}
).setFlavorText(["*Additional Note*", "Apply directly to the forehead."]);
