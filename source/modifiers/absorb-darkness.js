const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ModifierTemplate("Darkness Absorb",
	`Convert ${getEmoji("Darkness")} damage to healing`,
	"Buff",
	0,
	1
).setInverse("Darkness Weakness");
