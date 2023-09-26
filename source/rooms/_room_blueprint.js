const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("name",
	"element",
	"description",
	[
		new ResourceTemplate("countExpression", "visibility", "resourceType")
	]
).addEnemy("name", "countExpression");
