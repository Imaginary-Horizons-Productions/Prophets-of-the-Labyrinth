const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Quicken",
	"Increase move speed by @{stackCount*5} for @{stackCount} rounds.",
	true,
	false,
	0
).setInverse("Slow");
