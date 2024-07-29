const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Light Absorb",
	"Convert Light damage to health for @{stackCount} rounds.",
	"<:LightAbsorb:1267622644270895154>",
	true,
	false,
	1
).setInverse("Light Weakness");
