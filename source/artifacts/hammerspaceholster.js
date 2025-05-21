const { MessageLimits } = require("@sapphire/discord.js-utilities");
const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Hammerspace Holster",
	"Delvers can carry @{copies} more piece(s) of gear.",
	`Increase capacity by 1 per holster (${MessageLimits.MaximumActionRows} max)`,
	"Light",
	300
);
