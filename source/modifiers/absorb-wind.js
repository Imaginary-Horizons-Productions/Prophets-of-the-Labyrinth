const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Wind Absorb",
	"Convert Wind damage to health for @{stackCount} rounds.",
	true,
	false,
	false,
	1
).setInverse("Wind Weakness");
