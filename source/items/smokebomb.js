const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../util/actionComponents");
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
).setFlavorText(["___'s Commentary", "Take advantage of an enemy being blinded to run away? Who would do that?"]);
