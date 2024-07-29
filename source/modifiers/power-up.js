const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Power Up",
	"Increases damage dealt by moves by @{stackCount}. Also allows move damage to reach @{500+stackCount}.",
	"<:PowerUp:1267617452636770366>",
	true,
	false,
	0
).setInverse("Power Down");
