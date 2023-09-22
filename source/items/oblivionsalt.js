const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../util/moveUtil");
// const { addModifier } = require("../combatantDAO.js");

module.exports = new ItemTemplate("Salt of Oblivion",
	"Grants the user 1 Oblivious",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Oblivious", stacks: 1 });
		return `${user.getName(adventure.room.enemyIdMap)} gains Oblivious.`;
	}
);
