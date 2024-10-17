const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Agility",
	"Lose 2 Stagger between rounds for @{stackCount} rounds.",
	true,
	false,
	1
).setInverse("Paralysis");
