const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Excellence",
	"Increase damage cap by 20",
	"Buff",
	0,
	1
).setInverse("Degradation");
