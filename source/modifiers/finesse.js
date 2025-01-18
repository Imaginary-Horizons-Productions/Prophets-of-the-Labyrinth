const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Finesse",
	"Double Critical chance",
	"Buff",
	1,
	0
).setInverse("Clumsiness");
