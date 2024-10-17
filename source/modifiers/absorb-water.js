const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Water Absorb",
	"Convert Water damage to health for @{stackCount} rounds.",
	true,
	false,
	1
).setInverse("Water Weakness");
