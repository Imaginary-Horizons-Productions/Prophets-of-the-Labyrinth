const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Darkness Weakness",
	"Suffer weakness to Darkness damage",
	"Debuff",
	0,
	1
).setInverse("Darkness Absorb");
