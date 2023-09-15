const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Quicken",
	"The unit's next @{stackCount} move(s) will have +@{stackCount*5} speed.",
	false,
	true,
	false,
	0
).setInverse("Slow");
