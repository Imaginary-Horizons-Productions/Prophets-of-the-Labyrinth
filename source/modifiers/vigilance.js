const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Vigilance",
	"Retain @e{Evade} between rounds",
	"Buff",
	0,
	1
).setInverse("Distracted");
