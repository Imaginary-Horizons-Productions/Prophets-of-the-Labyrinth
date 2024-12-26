const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Finesse",
	"Double Critical Hit chance",
	"Buff",
	1,
	0
).setInverse("Clumsiness");
