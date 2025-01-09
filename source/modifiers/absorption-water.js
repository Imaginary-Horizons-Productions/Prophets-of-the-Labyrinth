const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/essenceUtil");

module.exports = new ModifierTemplate("Water Absorption",
	`Convert ${getEmoji("Water")} damage to healing`,
	"Buff",
	0,
	1
).setInverse("Water Vulnerability");
