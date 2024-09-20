const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, getNames } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");

module.exports = new ItemTemplate("Earthen Potion",
	"Grants the user 3 @e{Earth Absorb}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		const addedAbsorb = addModifier([user], { name: "Earth Absorb", stacks: 3 }).length > 0;
		if (addedAbsorb) {
			return [`${getNames([user], adventure)[0]} gains ${getApplicationEmojiMarkdown("Earth Absorb")}.`];
		} else {
			return [];
		}
	}
);
