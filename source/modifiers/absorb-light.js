const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ModifierTemplate("Light Absorb",
	`Convert ${getEmoji("Light")} damage to healing`,
	"Buff",
	0,
	1
).setInverse("Light Weakness");
