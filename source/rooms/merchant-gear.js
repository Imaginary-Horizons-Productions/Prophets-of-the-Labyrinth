const { RoomTemplate, ResourceTemplate } = require("../classes/RoomTemplate.js");
const { SAFE_DELIMITER } = require("../../constants.js");

module.exports = new RoomTemplate("Gear Merchant",
	"@{adventure}",
	"A masked figure sits in front of a rack of weapons and other equipment. \"Care to trade?\"",
	[
		new ResourceTemplate("n", "always", "gear").setTier("?").setUIGroup(`equipment${SAFE_DELIMITER}?`),
		new ResourceTemplate("1", "always", "gear").setTier("Rare").setUIGroup(`equipment${SAFE_DELIMITER}Rare`),
		new ResourceTemplate("1", "always", "scouting").setUIGroup("scouting")
	]
);
