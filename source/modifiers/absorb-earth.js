const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ModifierTemplate("Earth Absorb",
	`Convert ${getEmoji("Earth")} damage to healing`,
	"Buff",
	0,
	1
).setInverse("Earth Weakness");
