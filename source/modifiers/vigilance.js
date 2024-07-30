const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Vigilance",
	"Retain Evade between rounds for @{stackCount} rounds.",
	"<:Vigilance:1267886519314677781>",
	true,
	false,
	1
).setInverse("Distracted");
