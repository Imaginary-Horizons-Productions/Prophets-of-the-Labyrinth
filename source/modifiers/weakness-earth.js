const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Earth Weakness",
	"Suffer weakness to Earth damage for @{stackCount} rounds.",
	"<:EarthWeakness:1271513804399706133>",
	false,
	true,
	1
).setInverse("Earth Absorb");
