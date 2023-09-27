const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../util/actionComponents");
const { addModifier } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ItemTemplate("Watery Potion",
	"Grants the user 1 Water Absorb",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		// +1 Water Absorb
		addModifier(user, { name: "Water Absorb", stacks: 1 });
		return `${user.getName(adventure.room.enemyIdMap)} now absorbs ${getEmoji("Water")} damage.`;
	}
).setFlavorText(["*Additional Note*", "Apply directly to the forehead."]);
