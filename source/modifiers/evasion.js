const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Evasion",
	"Negate the next @{stacks} sets of move damage",
	"Buff",
	0,
	"all"
).setInverse("Exposure");
