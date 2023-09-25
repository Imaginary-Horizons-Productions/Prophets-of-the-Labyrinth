const { RoomTemplate, ResourceTemplate } = require("../classes/RoomTemplate.js");

module.exports = new RoomTemplate("name",
	"element",
	"description",
	[
		new ResourceTemplate("countExpression", "visibility", "resourceType")
	]
).addEnemy("name", "countExpression");
