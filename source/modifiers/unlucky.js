const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Unlucky",
	"Halve your Critical Hit chance for your next @{stackCount} move(s).",
	false,
	true,
	0
).setInverse("Lucky");
