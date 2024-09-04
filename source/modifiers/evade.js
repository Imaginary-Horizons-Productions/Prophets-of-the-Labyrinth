const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Evade",
	"Negate the next @{stackCount} set(s) of incoming damage. Lose @{roundDecrement} stacks each round.",
	"<:Evade:1267886574926958672>",
	true,
	false,
	"all"
).setInverse("Exposed");
