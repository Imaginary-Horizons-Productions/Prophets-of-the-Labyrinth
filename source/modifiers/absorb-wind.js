const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Wind Absorb",
	"Convert Wind damage to health for @{stackCount} rounds.",
	"<:WindAbsorb:1267622663069896897>",
	true,
	false,
	1
).setInverse("Wind Weakness");
