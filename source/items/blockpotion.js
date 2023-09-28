const { ItemTemplate } = require("../classes");
const { selectAllAllies } = require("../shared/actionComponents");
const { addBlock } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Block Potion",
	"Adds 50 block to all allies",
	"Untyped",
	30,
	selectAllAllies,
	([target], user, isCrit, adventure) => {
		addBlock(target, 50);
		return `${user.getName(adventure.room.enemyIdMap)} prepares to Block.`;
	}
);
