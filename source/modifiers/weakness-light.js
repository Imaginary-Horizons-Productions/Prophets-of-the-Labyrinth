const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Light Weakness",
	"Suffer Weakness to Light damage for @{stackCount} rounds.",
	false,
	true,
	1
).setInverse("Light Absorb");
