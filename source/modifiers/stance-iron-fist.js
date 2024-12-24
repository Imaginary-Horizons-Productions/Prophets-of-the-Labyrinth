const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Iron Fist Stance",
	"Increase Punch damage by @{stacks*45} and change its essence to the bearer's",
	"Buff",
	0,
	0
);
