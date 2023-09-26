const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Crystal Shard",
	"Spells have a @{0.85^copies*-1+1*100}% chance to avoid using durability when used.",
	"Increase chance of saving durability (multiplicatively) by 15% per shard",
	"Untyped"
);
