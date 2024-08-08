const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Slow",
	"Reduce move speed by @{stackCount*5} for @{stackCount} rounds.",
	"<:Slow:1271178646790340802>",
	false,
	true,
	0
).setInverse("Slow");
