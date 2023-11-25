const { GearTemplate, Move } = require('../classes');
const { dealDamage, gainHealth } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reactive Life Drain",
	"Strike a foe for @{damage} (+@{bonus} if after foe) @{element} damage, then gain @{healing} hp",
	"Healing x@{critMultiplier}",
	"Spell",
	"Darkness",
	350,
	([target], user, isCrit, adventure) => {
		const { element, damage, bonus, healing, critMultiplier } = module.exports;
		let pendingDamage = damage;
		let pendingHealing = healing;
		const userMove = adventure.room.moves.find(move => move.userReference.team === user.team && move.userReference.index === adventure.getCombatantIndex(user));
		const targetMove = adventure.room.moves.find(move => move.userReference.team === target.team && move.userReference.index === adventure.getCombatantIndex(target));

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage += bonus;
		}
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		return `${dealDamage([target], user, pendingDamage, false, element, adventure)} ${gainHealth(user, pendingHealing, adventure)}`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Flanking Life Drain", "Urgent Life Drain")
	.setDurability(15)
	.setDamage(40)
	.setHealing(25)
	.setBonus(50); // damage
