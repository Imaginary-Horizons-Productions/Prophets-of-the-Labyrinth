const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Untyped Absorb",
	"Convert Untyped damage to health for @{stackCount} rounds.",
	true,
	false,
	1
).setInverse("Untyped Weakness");
