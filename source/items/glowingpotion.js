const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ItemTemplate("Glowing Potion",
	"Grants the user 1 Light Absorb",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Light Absorb", stacks: 1 });
		return `${user.getName(adventure.room.enemyIdMap)} now absorbs ${getEmoji("Light")} damage.`;
	}
);
