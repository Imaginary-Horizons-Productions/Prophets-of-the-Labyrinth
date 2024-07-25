const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Wind Absorb",
	"Convert Wind damage to health for @{stackCount} rounds.",
	null,
	true,
	false,
	1
).setInverse("Wind Weakness");
