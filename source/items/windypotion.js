const { ItemTemplate } = require("../classes/Item.js");
const { selectSelf } = require("../util/moveUtil.js");
// const { addModifier } = require("../combatantDAO.js");
// const { getEmoji } = require("../elementHelpers.js");

module.exports = new ItemTemplate("Windy Potion",
	"Grants the user 1 Wind Absorb",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Wind Absorb", stacks: 1 });
		return `${user.getName(adventure.room.enemyIdMap)} now absorbs ${getEmoji("Wind")} damage.`;
	}
);
