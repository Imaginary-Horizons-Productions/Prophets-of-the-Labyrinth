const { GearTemplate, Move } = require('../classes');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reactive Spear",
	[
		["use", "Strike a foe for @{damage} (x@{critMultiplier} if after foe) @{element} damage"],
		["Critical💥", "Inflict @{bonus} more Stagger"]
	],
	"Weapon",
	"Earth",
	350,
	([target], user, adventure) => {
		const { element, bonus, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (user.crit) {
			changeStagger([target], bonus);
			resultLines.push(`${target.name} is Staggered.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Lethal Spear", "Sweeping Spear")
	.setDurability(15)
	.setDamage(65)
	.setBonus(2); // Crit Stagger
