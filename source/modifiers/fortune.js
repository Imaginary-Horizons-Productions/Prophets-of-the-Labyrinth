const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Fortune",
	"If stack count is divisible by 7 at end of round, convert all @e{Fortune} into <@{stacks*15}> protection",
	"Buff",
	0,
	1
).setInverse("Misfortune");
