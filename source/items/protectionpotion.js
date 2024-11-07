const { ItemTemplate } = require("../classes");
const { selectAllAllies } = require("../shared/actionComponents");
const { addProtection } = require("../util/combatantUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new ItemTemplate("Protection Potion",
	"Adds 50 protection to all allies",
	"Untyped",
	30,
	selectAllAllies,
	(targets, user, adventure) => {
		addProtection(targets, 50);
		return [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection.")];
	}
);
