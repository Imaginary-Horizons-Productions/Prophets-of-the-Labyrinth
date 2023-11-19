const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Quicken",
	"Increase move speed by @{stackCount*5} for @{stackCount} rounds.",
	false,
	true,
	0
).setInverse("Slow");
