const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Water Absorb",
	"Convert Water damage to healing",
	"Buff",
	0,
	1
).setInverse("Water Weakness");
