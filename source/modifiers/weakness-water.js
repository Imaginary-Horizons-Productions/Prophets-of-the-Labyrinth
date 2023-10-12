const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Water Weakness",
	"Suffer Weakness to Water damage for @{stackCount} rounds.",
	false,
	true,
	false,
	1
).setInverse("Water Absorb");