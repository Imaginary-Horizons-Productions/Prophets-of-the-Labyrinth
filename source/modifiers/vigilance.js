const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Vigilance",
	"Retain @e{Evasion} between rounds",
	"Buff",
	0,
	1
).setInverse("Distraction");
