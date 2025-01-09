const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Empowerment",
	"Increase move damage by @{stacks}",
	"Buff",
	0,
	0
).setInverse("Weakness");
