const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Retain",
	"Ignore the next @{stacks} attempts to remove buffs or debuffs (any number of stacks)",
	"State",
	0,
	0
);
