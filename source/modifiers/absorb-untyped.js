const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ModifierTemplate("Untyped Absorb",
	`Convert ${getEmoji("Untyped")} damage to healing`,
	"Buff",
	0,
	1
).setInverse("Untyped Weakness");
