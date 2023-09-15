const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Power Down",
	"Decreases damage dealt by moves by @{stackCount}.",
	false,
	true,
	false,
	0
).setInverse("Power Up");
