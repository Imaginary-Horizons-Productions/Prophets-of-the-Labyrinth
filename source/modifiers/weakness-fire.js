const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Fire Weakness",
	"Suffer weakness to Fire damage",
	"Debuff",
	0,
	1
).setInverse("Fire Absorb");
