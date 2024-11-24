const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Untyped Absorb",
	"Convert Untyped damage to healing",
	"Buff",
	0,
	1
).setInverse("Untyped Weakness");
