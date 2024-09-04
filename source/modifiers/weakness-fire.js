const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Fire Weakness",
	"Suffer weakness to Fire damage for @{stackCount} rounds.",
	"<:FireWeakness:1271514002840883310>",
	false,
	true,
	1
).setInverse("Fire Absorb");
