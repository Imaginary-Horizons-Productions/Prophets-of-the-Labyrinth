const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Darkness Absorb",
	"Convert Darkness damage to healing",
	"Buff",
	0,
	1
).setInverse("Darkness Weakness");
