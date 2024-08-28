const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Starry Knight", "1"]];

module.exports = new RoomTemplate("Confronting the Top Celestial Knight",
	"Light",
	"Final Battle",
	"Sitting by fireside, the Starry Knight looks up at the party, interrupted from his perusing of the memoirs of his own accolades. 'Oh, I didn't see you there! You're just in time to be added to the list of my glorious victories in combat!'",
	[
		new ResourceTemplate("5", "internal", "levelsGained")
	],
	function (adventure) { return {}; },
	generateCombatRoomBuilder(["appease"])
).setEnemies(enemies);
