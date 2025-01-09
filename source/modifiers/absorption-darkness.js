const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/essenceUtil");

module.exports = new ModifierTemplate("Darkness Absorption",
	`Convert ${getEmoji("Darkness")} damage to healing`,
	"Buff",
	0,
	1
).setInverse("Darkness Vulnerability");
