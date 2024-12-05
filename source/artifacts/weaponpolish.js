const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Weapon Polish",
	"Weapons have a @{0.85^copies*-1+1*100}% chance to reduce their cooldown by 1 when used.",
	"Increase chance of cooldown reduction (multiplicatively) by 15% per bottle of polish",
	"Untyped"
);
