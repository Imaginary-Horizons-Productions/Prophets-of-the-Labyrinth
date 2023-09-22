const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../util/moveUtil");
// const { addModifier } = require("../combatantDAO.js");

module.exports = new ItemTemplate("Strength Spinach",
	"Grants the user 50 Power Up",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Power Up", stacks: 50 });
		return `${user.getName(adventure.room.enemyIdMap)} is Powered Up.`;
	}
);
