const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Wind Weakness",
	"Suffer Weakness to Wind damage for @{stackCount} rounds.",
	false,
	true,
	1
).setInverse("Wind Weakness");
