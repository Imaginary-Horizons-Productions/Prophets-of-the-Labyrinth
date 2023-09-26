const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("A Slimy Throneroom",
	"@{adventure}",
	"A long hall of wavy mirrors sits silently between the party and the door... until a bunch of shadows step out of the mirror and attack the party!",
	[
		new ResourceTemplate("1", "loot", "artifact"),
		new ResourceTemplate("50*n", "loot", "gold")
	]
).addEnemy("Royal Slime", "0.5*n");
