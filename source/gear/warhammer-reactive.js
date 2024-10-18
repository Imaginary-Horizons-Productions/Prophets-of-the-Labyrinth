const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reactive Warhammer",
	[
		["use", "Strike a foe for @{damage} (+@{bonus} if foe is stunned, x@{critMultiplier} if after foe) @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Earth",
	350,
	([target], user, adventure) => {
		const { element, damage, bonus, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (target.isStunned) {
			pendingDamage += bonus;
		}
		const userMove = adventure.room.moves.find(move => move.userReference.team === user.team && move.userReference.index === adventure.getCombatantIndex(user));
		const targetMove = adventure.room.moves.find(move => move.userReference.team === target.team && move.userReference.index === adventure.getCombatantIndex(target));

		if (compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage *= critMultiplier;
		}

		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Slowing Warhammer", "Unstoppable Warhammer")
	.setDurability(15)
	.setDamage(40)
	.setBonus(75); // damage
