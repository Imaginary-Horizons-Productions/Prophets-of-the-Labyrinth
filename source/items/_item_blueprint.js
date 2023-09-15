const { ItemTemplate } = require("../classes/Item.js");

module.exports = new ItemTemplate("name", "description", selectTargets, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText([{ name: "", value: "" }]);

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
