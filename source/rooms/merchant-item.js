const { RoomTemplate, ResourceTemplate } = require("../classes");
const { SAFE_DELIMITER } = require("../../constants.js");

module.exports = new RoomTemplate("Item Merchant",
	"@{adventure}",
	"A masked figure sits in front of a a line up of flasks and vials. \"Care to trade?\"",
	[
		new ResourceTemplate("n", "always", "gear").setTier("?").setUIGroup(`equipment${SAFE_DELIMITER}?`),
		new ResourceTemplate("n", "always", "item").setUIGroup("items"),
		new ResourceTemplate("1", "always", "scouting").setUIGroup("scouting")
	]
);
