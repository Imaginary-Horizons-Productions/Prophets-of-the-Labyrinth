const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Regen",
	"Gain @{stackCount*10} HP after the bearer's turn. Lose @{roundDecrement} stack per round.",
	true,
	false,
	1
).setInverse("Poison");
