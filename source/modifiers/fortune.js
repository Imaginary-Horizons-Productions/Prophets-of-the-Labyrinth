const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Fortune",
	"If stacks is divisible by 7 at end of round, convert all @e{Fortune} into <30 x stacks> protection",
	"Buff",
	0,
	1
).setInverse("Misfortune");
