const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Poison",
	"Deals @{stackCount*10} (+@{funnelCount*5} on enemies due to Spiral Funnels) unblockable damage after the sufferer's turn. Lose @{roundDecrement} stack per round.",
	false,
	true,
	false,
	1
).setInverse("Regen");
