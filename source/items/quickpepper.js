const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../util/moveUtil");
// const { addModifier } = require("../combatantDAO.js");

module.exports = new ItemTemplate("Quick Pepper",
	"Grants the user 3 Quicken",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Quicken", stacks: 3 });
		return `${user.getName(adventure.room.enemyIdMap)} gains Quicken.`;
	}
);
