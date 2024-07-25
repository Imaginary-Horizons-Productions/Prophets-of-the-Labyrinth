const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Wind Weakness",
	"Suffer weakness to Wind damage for @{stackCount} rounds.",
	null,
	false,
	true,
	1
).setInverse("Wind Weakness");
