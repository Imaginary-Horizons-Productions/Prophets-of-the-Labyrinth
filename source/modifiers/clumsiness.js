const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Clumsiness",
	"Halve Critical chance",
	"Debuff",
	1,
	0
).setInverse("Finesse");
