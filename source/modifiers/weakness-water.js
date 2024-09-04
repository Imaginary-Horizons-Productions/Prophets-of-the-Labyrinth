const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Water Weakness",
	"Suffer weakness to Water damage for @{stackCount} rounds.",
	"<:WaterWeakness:1271513977381326937>",
	false,
	true,
	1
).setInverse("Water Absorb");
