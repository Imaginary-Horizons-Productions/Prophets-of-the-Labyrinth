const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents.js");
const { addModifier } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil.js");

module.exports = new ItemTemplate("Windy Potion",
	"Grants the user 3 @e{Wind Absorb}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		const addedAbsorb = addModifier([user], { name: "Wind Absorb", stacks: 3 }).length > 0;
		if (addedAbsorb) {
			return [`${user.name} gains ${getApplicationEmojiMarkdown("Wind Absorb")}.`];
		} else {
			return [];
		}
	}
);
