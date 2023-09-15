const { ItemTemplate } = require("../classes/Item.js");

module.exports = new ItemTemplate("name", "description", "Untyped", { description: "self", team: "any" }, 30, selectTargets, effect)
	.setFlavorText({ name: "", value: "" });

function selectTargets(userIndex, adventure) {
	// specification
	const team = "";
	const index = userIndex;
	return [[team, index]];
}

function effect(target, user, isCrit, adventure) {
	// specification
	return ``; // see style guide for conventions on result texts
}
