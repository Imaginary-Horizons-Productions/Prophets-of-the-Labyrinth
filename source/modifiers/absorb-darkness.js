const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Darkness Absorb",
	"Convert Darkness damage to health for @{stackCount} rounds.",
	true,
	false,
	1
).setInverse("Darkness Weakness");
