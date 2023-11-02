const { ItemTemplate } = require("../classes");
const { selectNone } = require("../shared/actionComponents");

module.exports = new ItemTemplate("Placebo",
	"Does nothing (on purpose).",
	"Untyped",
	30,
	selectNone,
	(targets, user, isCrit, adventure) => {
		return "But nothing happened!";
	}
);
