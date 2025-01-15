const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Degradation",
	"Reduce damage cap by @{stacks*20}",
	"Debuff",
	0,
	0
).setInverse("Excellence");
