const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Strength Spinach",
	"Grants the user 50 Power Up",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Power Up", stacks: 50 });
		return `${user.getName(adventure.room.enemyIdMap)} is Powered Up.`;
	}
).setFlavorText([{ name: "*Additional Notes*", value: "*It does what it says on the tin.*" }]);
