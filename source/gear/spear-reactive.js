const { GearTemplate, Move } = require('../classes');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reactive Spear",
	"Strike a foe for @{damage} (+@{bonus} if after foe) @{element} damage",
	"Also inflict @{foeStagger}",
	"Weapon",
	"Wind",
	350,
	([target], user, isCrit, adventure) => {
		const { element, stagger, damage, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const userMove = adventure.room.moves.find(move => move.userReference.team === user.team && move.userReference.index === adventure.getCombatantIndex(user));
		const targetMove = adventure.room.moves.find(move => move.userReference.team === target.team && move.userReference.index === adventure.getCombatantIndex(target));

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage += bonus;
		}
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		let resultText = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (isCrit) {
			changeStagger([target], stagger);
			resultText += ` ${target.getName(adventure.room.enemyIdMap)} is Staggered.`;
		}
		return resultText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Spear", "Sweeping Spear")
	.setStagger(2)
	.setDurability(15)
	.setDamage(65)
	.setBonus(75); // damage
