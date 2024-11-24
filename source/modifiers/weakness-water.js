const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Water Weakness",
	"Suffer weakness to Water damage",
	"Debuff",
	0,
	1
).setInverse("Water Absorb");
