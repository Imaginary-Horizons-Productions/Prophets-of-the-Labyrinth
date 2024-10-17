const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Lucky",
	"Double your Critical Hit chance for your next @{stackCount} move(s).",
	true,
	false,
	0
).setInverse("Unlucky");
