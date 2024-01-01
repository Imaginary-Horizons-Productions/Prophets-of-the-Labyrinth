const { RoomTemplate } = require("../classes");

module.exports = new RoomTemplate("The Hexagon",
	"Earth",
	"Myriad six-sided holograms flicker on as you enter the room displaying formations, statistics, and supply information. An alarm blares, and some mechabees (and their queen!) charge you. It dawns on you: they are in fact, more bee than mech.",
	[]
).addEnemy("Mecha Queen", "1")
	.addEnemy("Mechabee Drone", "n");
