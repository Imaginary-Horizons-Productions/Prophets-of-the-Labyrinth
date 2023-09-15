const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Power Up",
	"Increases damage dealt by moves by @{stackCount}. Also allows move damage to exceed 500 by @{stackCount}.",
	true,
	false,
	false,
	0
).setInverse("Power Down");
