const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Poison",
	"Deals @{stackCount*10} (+@{funnelCount*5} on enemies due to Spiral Funnels) unblockable damage after the sufferer's turn. Lose @{roundDecrement} stack per round.",
	"<:Poison:1266117138314432533>",
	false,
	true,
	1
).setInverse("Regen");
