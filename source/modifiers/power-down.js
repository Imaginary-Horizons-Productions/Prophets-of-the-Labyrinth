const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Power Down",
	"Decrease move damage by @{stacks}",
	"Debuff",
	0,
	0
).setInverse("Power Up");
