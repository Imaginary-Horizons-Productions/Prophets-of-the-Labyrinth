const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Iron Fist Stance",
	"Increase Punch damage by @{stackCount*45} and changes its element to yours.",
	null,
	true,
	false,
	0
);
