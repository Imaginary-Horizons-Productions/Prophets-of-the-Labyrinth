const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ItemTemplate("Earthen Potion",
	"Grants the user 3 Earth Absorb",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Earth Absorb", stacks: 3 });
		return `${user.getName(adventure.room.enemyIdMap)} now absorbs ${getEmoji("Earth")} damage.`;
	}
);
