const { RoomTemplate } = require("../classes");

module.exports = new RoomTemplate("A Northern Laboratory",
	"Water",
	"Flasks, beakers, vials and a myriad unknown substances line the innumerable tables and shelves of this room. An elk wanders from table to whiteboard to shelf, muttering various alchemical formuae to itself and taking absolutely no notice of the party.",
	[]
).addEnemy("Elkemist", "1");
