const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Floating Mist Stance",
	"Increase Punch stagger by @{stackCount*2} and gain @{stackCount*2} Evade each round.",
	true,
	false,
	0
);
