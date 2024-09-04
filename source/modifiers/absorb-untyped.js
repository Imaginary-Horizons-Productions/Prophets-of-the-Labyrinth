const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Untyped Absorb",
	"Convert Untyped damage to health for @{stackCount} rounds.",
	"<:UntypedAbsorb:1267622626566733897>",
	true,
	false,
	1
).setInverse("Untyped Weakness");
