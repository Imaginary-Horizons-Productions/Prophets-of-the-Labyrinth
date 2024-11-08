const { GearTemplate, Move } = require('../classes');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Staggering Stick",
	[
		["use", "Strike a foe for @{damage} (x@{bonus} if foe has priority) @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Technique",
	"Earth",
	350,
	([target], user, adventure) => {
		const { element, damage, bonus, critMultiplier } = module.exports;
		let pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}

		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage *= bonus;
		}

		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Sharpened Stick", "Shattering Stick")
	.setDurability(15)
	.setDamage(40)
	.setBonus(2)
	.setStagger(2);