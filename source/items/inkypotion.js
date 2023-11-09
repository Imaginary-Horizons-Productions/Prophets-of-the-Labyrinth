const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ItemTemplate("Inky Potion",
	"Grants the user 3 Darkness Absorb",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Darkness Absorb", stacks: 3 });
		return `${user.getName(adventure.room.enemyIdMap)} now absorbs ${getEmoji("Darkness")} damage.`;
	}
);
