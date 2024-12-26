const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Clumsiness",
	"Halve Critical Hit chance",
	"Debuff",
	1,
	0
).setInverse("Finesse");
