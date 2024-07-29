const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");

module.exports = new ItemTemplate("Fiery Potion",
	"Grants the user 3 Fire Absorb",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		const addedAbsorb = addModifier([user], { name: "Fire Absorb", stacks: 3 }).length > 0;
		if (addedAbsorb) {
			return `${getNames([user], adventure)[0]} now absorbs ${getEmoji("Fire")} damage.`;
		} else {
			return "But nothing happened.";
		}
	}
).setFlavorText({ name: "*Additional Notes*", value: "*Not to be confused with __Explosive Potion__. DO NOT apply to enemies.*" });
