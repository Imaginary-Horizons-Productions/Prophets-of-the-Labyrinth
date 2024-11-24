const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Untyped Weakness",
	"Suffer weakness to Untyped damage",
	"Debuff",
	0,
	1
).setInverse("Untyped Absorb");
