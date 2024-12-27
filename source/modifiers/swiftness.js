const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Swiftness",
	"Increase move speed by @{stacks*5}",
	"Buff",
	1,
	0
).setInverse("Torpidity");
