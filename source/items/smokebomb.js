const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Smoke Bomb",
	"Grants the user 2 @e{Evade}",
	"Untyped",
	30,
	selectSelf,
	(targets, user, adventure) => {
		return generateModifierResultLines(addModifier([user], { name: "Evade", stacks: 2 }));
	}
).setFlavorText({ name: "*Additional Notes*", value: "*\"While the foe suspects you're fleeing\" is the third best time to strike, beat only by \"when they least expect it\" and \"first\".*" });
