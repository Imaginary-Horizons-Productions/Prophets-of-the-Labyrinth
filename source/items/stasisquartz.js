const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Stasis Quartz",
	"Grants the user 1 Stasis",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Stasis", stacks: 1 });
		return `${user.getName(adventure.room.enemyIdMap)} enters Stasis.`;
	}
);
