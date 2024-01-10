const { ItemTemplate } = require("../classes");
const { selectAllAllies } = require("../shared/actionComponents");

module.exports = new ItemTemplate("Protection Potion",
	"Adds 50 block to all allies",
	"Untyped",
	30,
	selectAllAllies,
	false,
	([target], user, isCrit, adventure) => {
		target.block += 50;
		return `${user.getName(adventure.room.enemyIdMap)} gains protection.`;
	}
);
