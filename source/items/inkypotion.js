const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../util/actionComponents");
const { getEmoji } = require("../util/elementUtil");
// const { addModifier } = require("../combatantDAO.js");

module.exports = new ItemTemplate("Inky Potion",
	"Grants the user 1 Darkness Absorb",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Darkness Absorb", stacks: 1 });
		return `${user.getName(adventure.room.enemyIdMap)} now absorbs ${getEmoji("Darkness")} damage.`;
	}
);