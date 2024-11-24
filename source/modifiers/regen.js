const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Regen",
	"Gain @{stacks*10} HP after using a move",
	"Buff",
	1,
	0
).setInverse("Poison");
