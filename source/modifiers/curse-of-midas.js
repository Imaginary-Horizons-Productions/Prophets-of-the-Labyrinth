const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Curse of Midas",
	"Add @{stackCount} gold to loot for each 10 damage the bearer takes from moves.",
	false,
	true,
	0
);
