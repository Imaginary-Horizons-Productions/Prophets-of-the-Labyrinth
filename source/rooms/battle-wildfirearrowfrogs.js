const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Wild Fire-Arrow Frogs",
	"Fire",
	"A blaze of orange and red in the muck outs itself as a warning sign to a blast of heated mud and venom.",
	[
		new ResourceTemplate("1", "internal", "levelsGained"),
		new ResourceTemplate("25*n", "loot", "gold")
	],
	generateCombatRoomBuilder([])
).addEnemy("Fire-Arrow Frog", "n");
