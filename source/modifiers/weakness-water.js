const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ModifierTemplate("Water Weakness",
	`Suffer weakness to ${getEmoji("Water")} damage`,
	"Debuff",
	0,
	1
).setInverse("Water Absorb");
