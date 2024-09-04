const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Earth Absorb",
	"Convert Earth damage to health for @{stackCount} rounds.",
	"<:EarthAbsorb:1267622579762499646>",
	true,
	false,
	1
).setInverse("Earth Weakness");
