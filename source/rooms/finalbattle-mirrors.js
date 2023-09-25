const { RoomTemplate } = require("../classes");

module.exports = new RoomTemplate("Hall of Mirrors",
	"Untyped",
	"A long hall of wavy mirrors sits silently between the party and the door... until a bunch of shadows step out of the mirror and attack the party!",
	[]
).addEnemy("@{clone}", "n");
