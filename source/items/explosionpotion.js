const { ItemTemplate } = require("../classes");
const { selectAllFoes } = require("../shared/actionComponents");
const { dealDamage } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Explosion Potion",
	"Deal 75 damage to all enemies",
	"Untyped",
	30,
	selectAllFoes,
	true,
	(targets, user, isCrit, adventure) => {
		return dealDamage(targets, user, 75, false, "Untyped", adventure);
	}
).setFlavorText([{ name: "*Additional Notes*", value: "*Not to be confused with __Fiery Potion__. DO NOT apply to self.*" }]);
