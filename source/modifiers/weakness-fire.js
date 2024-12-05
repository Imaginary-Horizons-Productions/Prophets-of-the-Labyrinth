const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ModifierTemplate("Fire Weakness",
	`Suffer weakness to ${getEmoji("Fire")} damage`,
	"Debuff",
	0,
	1
).setInverse("Fire Absorb");
