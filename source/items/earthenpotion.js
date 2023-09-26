const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../util/actionComponents");
const { getEmoji } = require("../util/elementUtil");
// const { addModifier } = require("../combatantDAO.js");

module.exports = new ItemTemplate("Earthen Potion",
	"Grants the user 1 Earth Absorb",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Earth Absorb", stacks: 1 });
		return `${user.getName(adventure.room.enemyIdMap)} now absorbs ${getEmoji("Earth")} damage.`;
	}
);
