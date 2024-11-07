const { ItemTemplate } = require("../classes");

module.exports = new ItemTemplate("name",
	"description",
	"Untyped",
	30,
	(self, adventure) => {
		return [[self.team, adventure.getCombatantIndex(self)]];
	},
	(targets, user, adventure) => {
		return []; // see style guide for conventions on result texts
	}
).setFlavorText({ name: "", value: "" });
