const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Fire Weakness",
	"Suffer weakness to Fire damage for @{stackCount} rounds.",
	false,
	true,
	1
).setInverse("Fire Absorb");
