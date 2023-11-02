const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Frail",
	"Take @{stacks*10} damage when Stunned.",
	false,
	true,
	false,
	1
);
