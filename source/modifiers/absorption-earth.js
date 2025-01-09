const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/essenceUtil");

module.exports = new ModifierTemplate("Earth Absorption",
	`Convert ${getEmoji("Earth")} damage to healing`,
	"Buff",
	0,
	1
).setInverse("Earth Vulnerability");
