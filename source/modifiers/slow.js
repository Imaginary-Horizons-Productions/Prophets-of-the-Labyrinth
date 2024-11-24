const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Slow",
	"Reduce move speed by @{stacks*5}",
	"Debuff",
	1,
	0
).setInverse("Slow");
