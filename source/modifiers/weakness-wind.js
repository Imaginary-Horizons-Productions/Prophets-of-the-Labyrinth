const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Wind Weakness",
	"Suffer weakness to Wind damage",
	"Debuff",
	0,
	1
).setInverse("Wind Absorb");
