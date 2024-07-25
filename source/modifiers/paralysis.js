const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Paralysis",
	"Gain 1 Stagger instead of losing it between rounds for @{stackCount} rounds.",
	null,
	false,
	true,
	1
);
