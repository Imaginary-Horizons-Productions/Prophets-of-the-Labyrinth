const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Regen",
	"Gain @{stackCount*10} HP after the bearer's move.",
	true,
	false,
	1
).setInverse("Poison");
