const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Impotence",
	"Reduce Stagger applied by 1",
	"Debuff",
	1,
	0
).setInverse("Impact");
