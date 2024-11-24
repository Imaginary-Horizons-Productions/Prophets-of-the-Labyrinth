const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Earth Weakness",
	"Suffer weakness to Earth damage",
	"Debuff",
	0,
	1
).setInverse("Earth Absorb");
