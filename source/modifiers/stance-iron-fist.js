const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Iron Fist Stance",
	"Increase Punch damage by @{stacks*45} and change its element to the bearer",
	"Buff",
	0,
	0
);
