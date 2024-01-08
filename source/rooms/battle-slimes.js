const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("Slime Fight",
	"@{adventure}",
	"Some slimes and oozes approach...",
	[
		new ResourceTemplate("1", "internal", "levelsGained"),
		new ResourceTemplate("25*n", "loot", "gold")
	]
).addEnemy("@{adventure} Slime", "0.5*n")
	.addEnemy("@{adventureOpposite} Ooze", "0.5*n");
