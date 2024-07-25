const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Darkness Weakness",
	"Suffer weakness to Darkness damage for @{stackCount} rounds.",
	null,
	false,
	true,
	1
).setInverse("Darkness Absorb");
