const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("name",
	"element",
	"description",
	[
		new ResourceTemplate("countExpression", "visibility", "type")
	]
).addEnemy("name", "countExpression");
