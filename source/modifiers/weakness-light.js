const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ModifierTemplate("Light Weakness",
	`Suffer weakness to ${getEmoji("Light")} damage`,
	"Debuff",
	0,
	1
).setInverse("Light Absorb");
