const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Darkness Absorb",
	"Convert Darkness damage to health for @{stackCount} rounds.",
	"<:DarknessAbsorb:1267622596799762542>",
	true,
	false,
	1
).setInverse("Darkness Weakness");
