const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, getNames } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");

module.exports = new ItemTemplate("Strength Spinach",
	"Grants the user 50 @e{Power Up}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		const addedPowerUp = addModifier([user], { name: "Power Up", stacks: 50 }).length > 0;
		if (addedPowerUp) {
			return [`${getNames([user], adventure)[0]} gains ${getApplicationEmojiMarkdown("Power Up")}.`];
		} else {
			return [];
		}
	}
).setFlavorText({ name: "*Additional Notes*", value: "*It does what it says on the tin.*" });
