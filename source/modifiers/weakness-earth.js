const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Earth Weakness",
	"Suffer weakness to Earth damage for @{stackCount} rounds.",
	null,
	false,
	true,
	1
).setInverse("Earth Absorb");
