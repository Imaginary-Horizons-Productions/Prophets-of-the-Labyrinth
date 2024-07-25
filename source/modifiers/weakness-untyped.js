const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Untyped Weakness",
	"Suffer weakness to Untyped damage for @{stackCount} rounds.",
	null,
	false,
	true,
	1
).setInverse("Untyped Absorb");
