const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("Mechabee Fight",
	"Earth",
	"Some mechabees charge at you. In addition to starting a fight, it prompts you to wonder if mechabees are more mech or more bee.",
	[
		new ResourceTemplate("25*n", "loot", "gold")
	]
).addEnemy("Mechabee", "n");
