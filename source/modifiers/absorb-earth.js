const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Earth Absorb",
	"Convert Earth damage to health for @{stackCount} rounds.",
	true,
	false,
	1
).setInverse("Earth Weakness");
