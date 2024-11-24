const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Distracted",
	"Retain @e{Exposed} between rounds",
	"Debuff",
	0,
	1
).setInverse("Vigilance");
