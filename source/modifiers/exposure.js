const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Exposure",
	"Increase the next @{stacks} sets of move damage by 50%",
	"Debuff",
	0,
	"all"
).setInverse("Evasion");
