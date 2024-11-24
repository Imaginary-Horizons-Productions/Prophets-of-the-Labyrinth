const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Fire Absorb",
	"Convert Fire damage to healing",
	"Buff",
	0,
	1
).setInverse("Fire Weakness");
