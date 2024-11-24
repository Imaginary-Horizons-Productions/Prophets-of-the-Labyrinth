const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Power Up",
	"Increase move damage dealt by @{stacks} and increase damage cap to @{500+stacks}",
	"Buff",
	0,
	0
).setInverse("Power Down");
