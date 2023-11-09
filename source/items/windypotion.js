const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents.js");
const { addModifier } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ItemTemplate("Windy Potion",
	"Grants the user 3 Wind Absorb",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Wind Absorb", stacks: 3 });
		return `${user.getName(adventure.room.enemyIdMap)} now absorbs ${getEmoji("Wind")} damage.`;
	}
);
