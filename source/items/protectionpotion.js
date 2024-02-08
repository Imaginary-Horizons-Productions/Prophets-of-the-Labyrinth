const { ItemTemplate } = require("../classes");
const { selectAllAllies } = require("../shared/actionComponents");

module.exports = new ItemTemplate("Protection Potion",
	"Adds 50 protection to all allies",
	"Untyped",
	30,
	selectAllAllies,
	false,
	([target], user, isCrit, adventure) => {
		target.protection += 50;
		return `${user.getName(adventure.room.enemyIdMap)} gains protection.`;
	}
);
