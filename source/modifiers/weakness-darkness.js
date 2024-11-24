const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ModifierTemplate("Darkness Weakness",
	`Suffer weakness to ${getEmoji("Darkness")} damage`,
	"Debuff",
	0,
	1
).setInverse("Darkness Absorb");
