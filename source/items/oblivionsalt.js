const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");

module.exports = new ItemTemplate("Salt of Oblivion",
	"Grants the user 1 @e{Oblivious}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		addModifier([user], { name: "Oblivious", stacks: 1 });
		return [`${user.name} gains ${getApplicationEmojiMarkdown("Oblivious")}.`];
	}
);
