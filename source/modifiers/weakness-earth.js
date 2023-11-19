const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Earth Weakness",
	"Suffer Weakness to Earth damage for @{stackCount} rounds.",
	false,
	true,
	1
).setInverse("Earth Absorb");
