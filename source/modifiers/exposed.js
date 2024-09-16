const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Exposed",
	"Double the next @{stackCount} set(s) of incoming damage by 50%. Lose @{roundDecrement} stacks each round.",
	false,
	true,
	"all"
).setInverse("Evade");
