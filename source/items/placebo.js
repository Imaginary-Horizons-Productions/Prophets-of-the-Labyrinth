const { ItemTemplate } = require("../classes");
const { selectNone } = require("../shared/actionComponents");

module.exports = new ItemTemplate("Placebo",
	"Gain 25 score.",
	"Unaligned",
	30,
	selectNone,
	(targets, user, adventure) => {
		adventure.score += 25;
		return ["This adventure's score will be increased by 25."];
	}
);
