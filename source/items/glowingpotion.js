const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, getNames } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");

module.exports = new ItemTemplate("Glowing Potion",
	"Grants the user 3 @e{Light Absorb}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		const addedAbsorb = addModifier([user], { name: "Light Absorb", stacks: 3 }).length > 0;
		if (addedAbsorb) {
			return [`${getNames([user], adventure)[0]} gains ${getApplicationEmojiMarkdown("Light Absorb")}.`];
		} else {
			return [];
		}
	}
);
