const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Disempowerment",
	"Decrease move damage by @{stacks}",
	"Debuff",
	0,
	0
).setInverse("Empowerment");
