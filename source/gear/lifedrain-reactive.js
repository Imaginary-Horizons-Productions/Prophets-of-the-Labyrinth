const { GearTemplate, Move } = require('../classes');
const { dealDamage, gainHealth, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reactive Life Drain",
	"Strike a foe for @{damage} (+@{bonus} if after foe) @{element} damage, then gain @{healing} hp",
	"Healing x@{critMultiplier}",
	"Spell",
	"Darkness",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, bonus, healing, critMultiplier } = module.exports;
		const baseDamage = user.getPower() + damage;
		const userMove = adventure.room.moves.find(move => move.userReference.team === user.team && move.userReference.index === adventure.getCombatantIndex(user));
		const damagesByTargets = targets.map(target => {
			let pendingDamage = baseDamage;
			const targetMove = adventure.room.moves.find(move => move.userReference.team === target.team && move.userReference.index === adventure.getCombatantIndex(target));
			if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
				pendingDamage += bonus;
			}
			return [target, pendingDamage];
		});

		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const pendingHealing = isCrit ? healing * critMultiplier : healing;
		return `${damagesByTargets.map(([target, pendingDamage]) => dealDamage([target], user, pendingDamage, false, element, adventure)).join(" ")} ${gainHealth(user, pendingHealing, adventure)}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Flanking Life Drain", "Urgent Life Drain")
	.setDurability(15)
	.setDamage(40)
	.setHealing(25)
	.setBonus(50); // damage
