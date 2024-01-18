const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Hawk Fight",
	"Wind",
	"A flock of birds of prey swoop down looking for a meal.",
	[
		new ResourceTemplate("1", "internal", "levelsGained"),
		new ResourceTemplate("1.5*25*n", "loot", "gold")
	],
	generateCombatRoomBuilder([])
).addEnemy("Bloodtail Hawk", "1.5*n");
