const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Smoke Bomb",
	"Grants the user 2 Evade",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Evade", stacks: 2 });
		return `${user.getName(adventure.room.enemyIdMap)} prepares to Evade.`;
	}
).setFlavorText(["*Additional Notes*", "*While the foe suspects you're fleeing is the best time to strike.*"]);
