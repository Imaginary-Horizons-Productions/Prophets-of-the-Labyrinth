const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Wind Weakness",
	"Suffer Weakness to Wind damage for @{stackCount} rounds.",
	false,
	true,
	false,
	1
).setInverse("Wind Weakness");
