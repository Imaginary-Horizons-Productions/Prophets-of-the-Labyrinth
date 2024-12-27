const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Impact",
	"Increase Stagger applied by 1",
	"Buff",
	1,
	0
).setInverse("Impotence");
