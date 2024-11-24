const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Paralysis",
	"Gain 1 Stagger instead of losing it between rounds",
	"Debuff",
	0,
	1
).setInverse("Agility");
