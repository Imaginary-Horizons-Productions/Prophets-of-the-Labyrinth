const { ModifierTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ModifierTemplate("Untyped Weakness",
	`Suffer weakness to ${getEmoji("Untyped")} damage`,
	"Debuff",
	0,
	1
).setInverse("Untyped Absorb");
