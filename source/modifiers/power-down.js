const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Power Down",
	"Decreases damage dealt by moves by @{stackCount}.",
	"<:PowerDown:1267617436396687493>",
	false,
	true,
	0
).setInverse("Power Up");
