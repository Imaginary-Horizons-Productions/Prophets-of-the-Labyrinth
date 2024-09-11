const { GearTemplate, Move } = require('../classes');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reactive Spear",
	[
		["use", "Strike a foe for @{damage} (x@{critMultiplier} if after foe) @{element} damage"],
		["Critical💥", "Inflict @{bonus} more Stagger"]
	],
	"Weapon",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, bonus, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const userMove = adventure.room.moves.find(move => move.userReference.team === user.team && move.userReference.index === adventure.getCombatantIndex(user));
		const targetMove = adventure.room.moves.find(move => move.userReference.team === target.team && move.userReference.index === adventure.getCombatantIndex(target));

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		let resultText = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (isCrit) {
			changeStagger([target], bonus);
			resultText += ` ${getNames([target], adventure)[0]} is Staggered.`;
		}
		return resultText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Spear", "Sweeping Spear")
	.setDurability(15)
	.setDamage(65)
	.setBonus(2); // Crit Stagger
