const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("Tortoise Fight",
	"Earth",
	"The rocky terrain rises up to reveal a pair of shelled menaces.",
	[
		new ResourceTemplate("gold", "80", "loot")
	]
).addEnemy("Geode Tortoise", "2");
