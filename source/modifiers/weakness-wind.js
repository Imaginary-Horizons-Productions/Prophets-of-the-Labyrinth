const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ModifierTemplate("Wind Weakness",
	`Suffer weakness to ${getEmoji("Wind")} damage`,
	"Debuff",
	0,
	1
).setInverse("Wind Absorb");
