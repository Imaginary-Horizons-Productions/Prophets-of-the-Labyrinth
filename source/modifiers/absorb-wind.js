const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Wind Absorb",
	"Convert Wind damage to healing",
	"Buff",
	0,
	1
).setInverse("Wind Weakness");
