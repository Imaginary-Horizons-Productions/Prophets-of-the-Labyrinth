const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Weapon Polish",
	"Gear in the Offense category has a @{0.85^copies*-1+1*100}% chance to reduce its cooldown by 1 when used.",
	"Increase chance of cooldown reduction (multiplicatively) by 15% per bottle of polish",
	"Unaligned",
	300
);
