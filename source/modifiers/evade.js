const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Evade",
	"Negate the next @{stackCount} set(s) of incoming damage. Lose @{roundDecrement} stacks each round.",
	null,
	true,
	false,
	"all"
).setInverse("Exposed");
