const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Paralysis",
	"Gain 1 Stagger instead of losing it between rounds for @{stackCount} rounds.",
	"<:Paralysis:1266521422663123025>",
	false,
	true,
	1
).setInverse("Agility");
