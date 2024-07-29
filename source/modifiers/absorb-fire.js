const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Fire Absorb",
	"Convert Fire damage to health for @{stackCount} rounds.",
	"<:FireAbsorb:1267622564612800633>",
	true,
	false,
	1
).setInverse("Fire Weakness");
