const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Regen",
	"Gain @{stackCount*10} hp after the bearer's turn. Lose @{roundDecrement} stack per round.",
	"<:Regen:1266117153518653451>",
	true,
	false,
	1
).setInverse("Poison");
