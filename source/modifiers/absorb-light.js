const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Light Absorb",
	"Convert Light damage to health for @{stackCount} rounds.",
	true,
	false,
	false,
	1
).setInverse("Darkness Absorb");