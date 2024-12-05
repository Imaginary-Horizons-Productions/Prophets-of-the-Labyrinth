const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ModifierTemplate("Fire Absorb",
	`Convert ${getEmoji("Fire")} damage to healing`,
	"Buff",
	0,
	1
).setInverse("Fire Weakness");
