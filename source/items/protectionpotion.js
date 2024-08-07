const { ItemTemplate } = require("../classes");
const { selectAllAllies } = require("../shared/actionComponents");
const { addProtection, getNames } = require("../util/combatantUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new ItemTemplate("Protection Potion",
	"Adds 50 protection to all allies",
	"Untyped",
	30,
	selectAllAllies,
	false,
	(targets, user, isCrit, adventure) => {
		addProtection(targets, 50);
		return joinAsStatement(false, getNames(targets, adventure), "gains", "gain", "protection.");
	}
);
