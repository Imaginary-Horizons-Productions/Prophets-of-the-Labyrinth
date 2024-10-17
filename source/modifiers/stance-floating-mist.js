const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Floating Mist Stance",
	"Increase Punch Stagger by @{stackCount*3} and gain @{stackCount*2} Evade each round.",
	true,
	false,
	0
);
