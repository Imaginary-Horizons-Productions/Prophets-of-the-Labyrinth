const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, getNames } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Smoke Bomb",
	"Grants the user 2 @e{Evade}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		const addedEvade = addModifier([user], { name: "Evade", stacks: 2 }).length > 0;
		if (addedEvade) {
			return `${getNames([user], adventure)[0]} prepares to Evade.`;
		} else {
			return "But nothing happened.";
		}
	}
).setFlavorText({ name: "*Additional Notes*", value: "*\"While the foe suspects you're fleeing\" is the third best time to strike, beat only by \"when they least expect it\" and \"first\".*" });
