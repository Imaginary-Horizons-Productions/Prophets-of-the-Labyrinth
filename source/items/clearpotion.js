const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../util/actionComponents");
const { getEmoji } = require("../util/elementUtil");
// const { addModifier } = require("../combatantDAO.js");

module.exports = new ItemTemplate("Clear Potion",
	"Grants the user 1 Untyped Absorb",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Untyped Absorb", stacks: 1 });
		return `${user.getName(adventure.room.enemyIdMap)} now absorbs ${getEmoji("Untyped")} damage.`;
	}
);