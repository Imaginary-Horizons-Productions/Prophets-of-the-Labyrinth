const { ItemTemplate } = require("../classes");
const { selectAllFoes } = require("../shared/actionComponents");
const { dealDamage } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Explosion Potion",
	"Deal 75 damage to all enemies",
	"Unaligned",
	30,
	selectAllFoes,
	(targets, user, adventure) => {
		return dealDamage(targets, user, 75, false, "Unaligned", adventure).resultLines;
	}
).setFlavorText({ name: "*Additional Notes*", value: "*Not to be confused with __Fiery Potion__. DO NOT apply to self.*" });
