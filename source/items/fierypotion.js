const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../util/actionComponents");
const { addModifier } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ItemTemplate("Fiery Potion",
	"Grants the user 1 Fire Absorb",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Fire Absorb", stacks: 1 });
		return `${user.getName(adventure.room.enemyIdMap)} now absorbs ${getEmoji("Fire")} damage.`;
	}
).setFlavorText(["*Additional Notes*", "*Not to be confused with __Explosive Potion__. DO NOT apply to enemies.*"]);
