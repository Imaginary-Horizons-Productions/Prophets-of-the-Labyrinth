const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/essenceUtil");

module.exports = new ModifierTemplate("Unaligned Absorption",
	`Convert ${getEmoji("Unaligned")} damage to healing`,
	"Buff",
	0,
	1
).setInverse("Unaligned Vulnerability");
