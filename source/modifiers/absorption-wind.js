const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/essenceUtil");

module.exports = new ModifierTemplate("Wind Absorption",
	`Convert ${getEmoji("Wind")} damage to healing`,
	"Buff",
	0,
	1
).setInverse("Wind Vulnerability");
