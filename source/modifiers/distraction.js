const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Distraction",
	"Retain @e{Exposure} between rounds",
	"Debuff",
	0,
	1
).setInverse("Vigilance");
