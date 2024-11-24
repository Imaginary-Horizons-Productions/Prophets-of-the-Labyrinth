const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Unlucky",
	"Halve Critical Hit chance",
	"Debuff",
	1,
	0
).setInverse("Lucky");
