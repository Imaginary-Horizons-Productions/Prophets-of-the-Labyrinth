const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Exposed",
	"Increase the next @{stackCount} set(s) of incoming damage by 50%. Lose @{roundDecrement} stacks each round.",
	"<:Exposed:1267886492093517950>",
	false,
	true,
	"all"
).setInverse("Evade");
