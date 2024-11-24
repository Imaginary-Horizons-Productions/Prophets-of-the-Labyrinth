const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Light Weakness",
	"Suffer weakness to Light damage",
	"Debuff",
	0,
	1
).setInverse("Light Absorb");
