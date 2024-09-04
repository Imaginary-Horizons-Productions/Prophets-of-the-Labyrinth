const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Unlucky",
	"Halve your Critical Hit chance for your next @{stackCount} move(s).",
	"<:Unlucky:1266117872984260610>",
	false,
	true,
	0
).setInverse("Lucky");
