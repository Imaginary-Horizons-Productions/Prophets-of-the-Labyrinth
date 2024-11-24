const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Light Absorb",
	"Convert Light damage to healing",
	"Buff",
	0,
	1
).setInverse("Light Weakness");
