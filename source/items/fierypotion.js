const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { addModifier, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Fiery Potion",
	"Grants the user 3 @e{Fire Absorb}",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		return generateModifierResultLines(addModifier([user], { name: "Fire Absorb", stacks: 3 }));
	}
).setFlavorText({ name: "*Additional Notes*", value: "*Not to be confused with __Explosive Potion__. DO NOT apply to enemies.*" });
