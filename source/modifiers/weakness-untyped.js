const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Untyped Weakness",
	"Suffer Weakness to Untyped damage for @{stackCount} rounds.",
	false,
	true,
	false,
	1
).setInverse("Untyped Absorb");
