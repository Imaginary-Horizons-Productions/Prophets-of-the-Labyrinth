const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Weakness",
	"Decrease move damage by @{stacks}",
	"Debuff",
	0,
	0
).setInverse("Empowerment");
