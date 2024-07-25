const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Slow",
	"Reduce move speed by @{stackCount*5} for @{stackCount} rounds.",
	null,
	false,
	true,
	0
).setInverse("Slow");
