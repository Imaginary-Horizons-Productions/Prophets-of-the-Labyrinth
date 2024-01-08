const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("Hawk Fight",
	"Wind",
	"A flock of birds of prey swoop down looking for a meal.",
	[
		new ResourceTemplate("1", "internal", "levelsGained"),
		new ResourceTemplate("1.5*25*n", "loot", "gold")
	]
).addEnemy("Bloodtail Hawk", "1.5*n");
