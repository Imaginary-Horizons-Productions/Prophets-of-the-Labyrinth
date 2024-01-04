const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Weapon Polish",
	"Weapons have a @{0.85^copies*-1+1*100}% chance to avoid losing durability when used.",
	"Increase chance of saving durability (multiplicatively) by 15% per bottle of polish",
	"Untyped"
);
