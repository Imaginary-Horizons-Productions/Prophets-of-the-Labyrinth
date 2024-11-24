const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ModifierTemplate("Water Absorb",
	`Convert ${getEmoji("Water")} damage to healing`,
	"Buff",
	0,
	1
).setInverse("Water Weakness");
