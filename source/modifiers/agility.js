const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Agility",
	"Lose 2 Stagger between rounds for @{stackCount} rounds.",
	"<:Agility:1271178184288768076>",
	true,
	false,
	1
).setInverse("Paralysis");
