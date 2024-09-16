const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Distracted",
	"Retain Exposed between rounds for @{stackCount} rounds.",
	false,
	true,
	1
).setInverse("Vigilance");
