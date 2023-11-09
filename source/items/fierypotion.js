const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ItemTemplate("Fiery Potion",
	"Grants the user 3 Fire Absorb",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		addModifier(user, { name: "Fire Absorb", stacks: 3 });
		return `${user.getName(adventure.room.enemyIdMap)} now absorbs ${getEmoji("Fire")} damage.`;
	}
).setFlavorText(["*Additional Notes*", "*Not to be confused with __Explosive Potion__. DO NOT apply to enemies.*"]);
