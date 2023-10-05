const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Light Weakness",
	"Suffer Weakness to Light damage for @{stackCount} rounds.",
	false,
	true,
	false,
	1
).setInverse("Light Absorb");
