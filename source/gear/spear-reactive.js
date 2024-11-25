const { GearTemplate, Move } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reactive Spear",
	[
		["use", "Strike a foe for <@{damage} + @{bonus2} if after foe> @{element} damage"],
		["Critical💥", "Inflict @{bonus} more Stagger"]
	],
	"Weapon",
	"Earth",
	350,
	([target], user, adventure) => {
		const { element, bonus, damage, bonus2 } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingStagger = 0;
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage *= bonus2;
		}
		if (user.element === element) {
			pendingStagger += ELEMENT_MATCH_STAGGER_FOE;
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (user.crit) {
			pendingStagger += bonus;
			resultLines.push(`${target.name} is Staggered.`);
		}
		if (pendingStagger > 0) {
			changeStagger([target], user, pendingStagger);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Lethal Spear", "Sweeping Spear")
	.setDurability(15)
	.setDamage(65)
	.setBonus(2) // Crit Stagger
	.setBonus2(75); // Reactive Multiplier
