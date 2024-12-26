const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Misfortune",
	"If stacks is divisible by 7 at end of round, convert all @e{Misfortune} into <30 x stacks + (2 x Spiral Funnels) on enemies> damage",
	"Debuff",
	0,
	1
).setInverse("Fortune");
