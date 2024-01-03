const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Crystal Shard",
	"Increase the blast range of Spells by @{copies}. Single target Spells become Blast @{copies}.",
	"Increase range boost 1 per shard",
	"Untyped"
);
