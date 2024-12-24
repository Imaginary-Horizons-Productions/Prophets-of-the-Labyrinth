const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/essenceUtil");

module.exports = new ModifierTemplate("Light Absorption",
	`Convert ${getEmoji("Light")} damage to healing`,
	"Buff",
	0,
	1
).setInverse("Light Vulnerability");
