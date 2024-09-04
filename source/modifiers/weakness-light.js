const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Light Weakness",
	"Suffer weakness to Light damage for @{stackCount} rounds.",
	"<:LightWeakness:1271513902655602719>",
	false,
	true,
	1
).setInverse("Light Absorb");
