const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Meteor Knight Fight",
	"Fire",
	"Battle",
	"You are halted by a company of knights. By the time a Earthly Knight has advanced one step towards you, the Meteor Knight has recklessly charged across most of the gap!",
	[
		new ResourceTemplate("1", "internal", "levelsGained"),
		new ResourceTemplate("1.5*25*n", "loot", "gold")
	],
	function (adventure) { return {}; },
	generateCombatRoomBuilder([])
).addEnemy("Earthly Knight", "0.5*n")
	.addEnemy("Meteor Knight", "1")
	.addEnemy("Asteroid", "0.25*n-1");
