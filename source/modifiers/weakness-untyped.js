const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Untyped Weakness",
	"Suffer Weakness to Untyped damage for @{stackCount} rounds.",
	false,
	true,
	1
).setInverse("Untyped Absorb");
