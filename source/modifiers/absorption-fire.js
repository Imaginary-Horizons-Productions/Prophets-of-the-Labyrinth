const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/essenceUtil");

module.exports = new ModifierTemplate("Fire Absorption",
	`Convert ${getEmoji("Fire")} damage to healing`,
	"Buff",
	0,
	1
).setInverse("Fire Vulnerability");
