const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Frail",
	"Deals @{stackCount*20} (+@{funnelCount*5} on enemies due to Spiral Funnels) damage when Stunned. Lose @{roundDecrement} stack per round.",
	null,
	false,
	true,
	1
);
