const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { gainHealth } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Health Potion",
	"Heals the user by 25% of their max HP",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, adventure) => {
		return [gainHealth(user, Math.floor(user.getMaxHP() * 0.25), adventure)];
	}
);
