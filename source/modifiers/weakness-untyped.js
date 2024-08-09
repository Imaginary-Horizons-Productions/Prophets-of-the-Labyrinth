const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Untyped Weakness",
	"Suffer weakness to Untyped damage for @{stackCount} rounds.",
	"<:UntypedWeakness:1271513869893763093>",
	false,
	true,
	1
).setInverse("Untyped Absorb");
