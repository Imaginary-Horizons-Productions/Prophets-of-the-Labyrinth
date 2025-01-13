const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Misfortune",
	"If stack count is divisible by 7 at end of round, convert all @e{Misfortune} into <@{stacks*30} + @{funnelCount*2} on enemies due to Spiral Funnels> damage",
	"Debuff",
	0,
	1
).setInverse("Fortune");
