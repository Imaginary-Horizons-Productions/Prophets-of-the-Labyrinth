const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Earth Absorb",
	"Convert Earth damage to healing",
	"Buff",
	0,
	1
).setInverse("Earth Weakness");
