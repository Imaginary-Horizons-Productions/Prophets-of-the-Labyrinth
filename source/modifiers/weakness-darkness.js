const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Darkness Weakness",
	"Suffer Weakness to Darkness damage for @{stackCount} rounds.",
	false,
	true,
	false,
	1
).setInverse("Darkness Absorb");
