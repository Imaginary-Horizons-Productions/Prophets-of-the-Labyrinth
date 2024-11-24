const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ModifierTemplate("Wind Absorb",
	`Convert ${getEmoji("Wind")} damage to healing`,
	"Buff",
	0,
	1
).setInverse("Wind Weakness");
