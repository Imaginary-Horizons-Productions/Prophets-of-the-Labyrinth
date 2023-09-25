const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("Slime Fight",
	"@{adventure}",
	"Some slimes and oozes approach...",
	[
		new ResourceTemplate("gold", "25*n", "loot")
	]
).addEnemy("@{adventure} Slime", "0.5*n")
	.addEnemy("@{adventureOpposite} Ooze", "0.5*n");
