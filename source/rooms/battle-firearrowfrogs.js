const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("Frog Fight",
	"Fire",
	"A blaze of orange and red in the muck the outs itself as a warning sign to a blast of heated mud and venom.",
	[
		new ResourceTemplate("gold", "25*n", "loot")
	]
).addEnemy("Fire-Arrow Frog", "n");
