const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Attunement",
	"Double Essence Counter damage",
	"Buff",
	1,
	0
).setInverse("Incompatibility");
