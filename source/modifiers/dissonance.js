const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Dissonance",
	"Halve Essence Counter damage",
	"Debuff",
	1,
	0
).setInverse("Resonance");
