const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Incompatability",
	"Halve Essence Counter damage",
	"Debuff",
	1,
	0
).setInverse("Attunement");
