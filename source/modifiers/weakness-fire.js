const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Fire Weakness",
	"Suffer Weakness to Fire damage for @{stackCount} rounds.",
	false,
	true,
	false,
	1
).setInverse("Fire Absorb");
