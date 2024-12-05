const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Impactful",
	"Increase Stagger applied by 1",
	"Buff",
	1,
	0
).setInverse("Ineffectual");
