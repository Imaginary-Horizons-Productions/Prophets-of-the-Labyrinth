const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("Treasure! Gold or Consumables?",
	"@{adventure}",
	"Two treasure boxes sit on opposite ends of a seesaw suspended above pits of molten rock. They are labled 'Gold' and 'Consumable Bundle' respectively, and it looks as if taking one will surely cause the other to plummet into the pit below.",
	[
		new ResourceTemplate("1", "internal", "roomAction"),
		new ResourceTemplate("250*n", "always", "gold").setCostMultiplier(0),
		new ResourceTemplate("2", "always", "item").setCostMultiplier(0)
	]
);