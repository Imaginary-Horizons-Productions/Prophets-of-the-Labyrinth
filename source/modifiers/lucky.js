const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Lucky",
	"Double Critical Hit chance",
	"Buff",
	1,
	0
).setInverse("Unlucky");
