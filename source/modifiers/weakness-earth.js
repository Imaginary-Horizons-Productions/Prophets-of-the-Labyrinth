const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ModifierTemplate("Earth Weakness",
	`Suffer weakness to ${getEmoji("Earth")} damage`,
	"Debuff",
	0,
	1
).setInverse("Earth Absorb");
