const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Stick",
	[
		["use", "Strike a foe for <@{damage} x @{bonus} if foe has priority> @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Technique",
	"Earth",
	200,
	([target], user, adventure) => {
		const { element, damage, bonus, critMultiplier } = module.exports;
		let pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}

		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		if (targetMove.priority > 0) {
			pendingDamage *= bonus;
		}

		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Sharpened Stick", "Shattering Stick", "Staggering Stick")
	.setDurability(15)
	.setDamage(40)
	.setBonus(2);
