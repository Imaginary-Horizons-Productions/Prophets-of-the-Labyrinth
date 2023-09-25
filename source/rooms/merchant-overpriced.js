const { RoomTemplate, ResourceTemplate } = require("../classes/RoomTemplate.js");
const { SAFE_DELIMITER } = require("../../constants.js");

module.exports = new RoomTemplate("Overpriced Merchant",
	"@{adventure}",
	"A masked figure sits in front of a packed rack of weapons and other equipment. \"Best selction around! Looking for something particular?\"",
	[
		new ResourceTemplate("2*n", "always", "gear").setTier("?").setCostMultiplier(1.5).setUIGroup(`equipment${SAFE_DELIMITER}?`),
		new ResourceTemplate("2", "always", "gear").setTier("Rare").setCostMultiplier(1.5).setUIGroup(`equipment${SAFE_DELIMITER}Rare`),
		new ResourceTemplate("1", "always", "scouting").setUIGroup("scouting")
	]
);
