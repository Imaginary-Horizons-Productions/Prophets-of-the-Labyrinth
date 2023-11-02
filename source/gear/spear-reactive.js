const { GearTemplate, Move } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reactive Spear",
	"Strike a foe for @{damage} (+@{bonus} if after foe) @{element} damage",
	"Also inflict @{stagger}",
	"Weapon",
	"Wind",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, stagger, damage, bonus } = module.exports;
		const userMove = adventure.room.moves.find(move => move.userReference.team === user.team && move.userReference.index === adventure.getCombatantIndex(user));
		const targetMove = adventure.room.moves.find(move => move.userReference.team === target.team && move.userReference.index === adventure.getCombatantIndex(target));

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			damage += bonus;
		}
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			target.addStagger(stagger);
		}
		return dealDamage([target], user, damage, false, element, adventure);
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Lethal Spear", "Sweeping Spear")
	.setStagger(2)
	.setDurability(15)
	.setDamage(100)
	.setBonus(75); // damage
