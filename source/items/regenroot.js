const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");

module.exports = new ItemTemplate("Regen Root",
	`Grants the user 5 @e{Regen}`,
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		const addedRegen = addModifier([user], { name: "Regen", stacks: 5 }).length > 0;
		if (addedRegen) {
			return [`${user.name} gains ${getApplicationEmojiMarkdown("Regen")}.`];
		} else {
			return [];
		}
	}
);
