const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Agility",
	"Shrug off 2 Stagger between rounds",
	"Buff",
	0,
	1
).setInverse("Paralysis");
