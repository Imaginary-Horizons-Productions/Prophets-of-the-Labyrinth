const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Fire Absorb",
	"Convert Fire damage to health for @{stackCount} rounds.",
	true,
	false,
	1
).setInverse("Fire Weakness");
