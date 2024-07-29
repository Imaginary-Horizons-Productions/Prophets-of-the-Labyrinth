const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Water Absorb",
	"Convert Water damage to health for @{stackCount} rounds.",
	"<:WaterAbsorb:1267622542194249858>",
	true,
	false,
	1
).setInverse("Water Weakness");
