const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Slow",
	"The unit's next @{stackCount} move(s) will have -@{stackCount*5} speed.",
	false,
	true,
	0
).setInverse("Slow");
