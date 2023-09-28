const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Regen Root",
	"Grants the user 5 Regen",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Regen", stacks: 5 });
		return `${user.getName(adventure.room.enemyIdMap)} gains Regen.`;
	}
);
