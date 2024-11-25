const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Ineffectual",
	"Reduce Stagger applied by 1",
	"Debuff",
	1,
	0
).setInverse("Impactful");
