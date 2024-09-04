const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Distracted",
	"Retain Exposed between rounds for @{stackCount} rounds.",
	"<:Distracted:1267886545638129848>",
	false,
	true,
	1
).setInverse("Vigilance");
