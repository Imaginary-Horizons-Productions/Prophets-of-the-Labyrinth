const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Water Weakness",
	"Suffer weakness to Water damage for @{stackCount} rounds.",
	false,
	true,
	1
).setInverse("Water Absorb");
