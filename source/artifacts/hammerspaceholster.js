const { ArtifactTemplate } = require("../classes");
const { MAX_MESSAGE_ACTION_ROWS } = require("../constants.js");

module.exports = new ArtifactTemplate("Hammerspace Holster",
	"Delvers can carry @{copies} more piece(s) of gear.",
	`Increase capacity by 1 per holster (${MAX_MESSAGE_ACTION_ROWS} max)`,
	"Light"
);
