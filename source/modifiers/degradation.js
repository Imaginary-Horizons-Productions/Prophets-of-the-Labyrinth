const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Degradation",
	"Reduce damage cap by 20",
	"Debuff",
	0,
	0
).setInverse("Excellence");
