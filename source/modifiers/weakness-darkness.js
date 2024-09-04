const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Darkness Weakness",
	"Suffer weakness to Darkness damage for @{stackCount} rounds.",
	"<:DarknessWeakness:1271513836213764137>",
	false,
	true,
	1
).setInverse("Darkness Absorb");
