const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Vigilance",
	"Retain Evade between rounds for @{stackCount} rounds.",
	true,
	false,
	1
).setInverse("Distracted");
