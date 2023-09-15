const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Oblivious",
	"Ignore the next @{stackCount} attempt(s) to add buffs or debuffs (any number of stacks).",
	false,
	false,
	false,
	0
);
