const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Resonance",
	"Double Essence Counter damage",
	"Buff",
	1,
	0
).setInverse("Dissonance");
