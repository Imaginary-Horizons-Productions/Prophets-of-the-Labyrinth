const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Light Weakness",
	"Suffer weakness to Light damage for @{stackCount} rounds.",
	false,
	true,
	1
).setInverse("Light Absorb");
