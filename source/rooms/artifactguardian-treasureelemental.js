const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("A windfall of treasure!",
	"Earth",
	"Floor to ceiling, gold coins, gems and other valuables are stacked in massive piles. Out of the corner of your eyes, you notice a mass of treasure meld together...",
	[
		new ResourceTemplate("1", "loot", "artifact")
	]
).addEnemy("Treasure Elemental", "1");
