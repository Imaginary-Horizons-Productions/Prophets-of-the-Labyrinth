const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Quick Pepper",
	"Grants the user 3 Quicken",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Quicken", stacks: 3 });
		return `${user.getName(adventure.room.enemyIdMap)} gains Quicken.`;
	}
);
