const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Darness Absorb",
	"Convert Darkness damage to health for @{stackCount} rounds.",
	true,
	false,
	false,
	1
).setInverse("Light Absorb");
