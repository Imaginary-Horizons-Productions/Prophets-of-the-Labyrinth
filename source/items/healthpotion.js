const { ItemTemplate } = require("../classes/Item.js");
// const { gainHealth } = require("../combatantDAO.js");
// const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ItemTemplate("Health Potion", "Heals the user by 25% of their max HP", "Untyped", { description: "self", team: "any" }, 30, /*selectSelf*/ null, effect);

function effect(targets, user, isCrit, adventure) {
	// +25% max hp
	return gainHealth(user, Math.floor(user.maxHp * 0.25), adventure);
}
