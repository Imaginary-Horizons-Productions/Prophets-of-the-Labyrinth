const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Retain",
	"Ignore the next @{stackCount} attempt(s) to remove buffs or debuffs (any number of stacks).",
	false,
	false,
	0
);
