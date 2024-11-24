const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Poison",
	"Take @{stacks*10} (+@{funnelCount*2} on enemies due to Spiral Funnels) unblockable damage after using a move",
	"Debuff",
	1,
	0
).setInverse("Regen");
