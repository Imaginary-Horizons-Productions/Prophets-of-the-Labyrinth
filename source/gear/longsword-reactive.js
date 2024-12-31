const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Reactive Longsword",
	[
		["use", "Deal <@{damage} + @{bonus} if after foe> @{essence} damage to a single foe, gain an extra level after combat if they're downed"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Offense",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { essence, damage, bonus, critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(targets[0]), team: targets[0].team });

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage += bonus;
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		let killCount = 0;
		targets.forEach(target => {
			if (target.hp < 1) {
				killCount++
			}
		})
		if (killCount > 0) {
			adventure.room.addResource(`levelsGained${SAFE_DELIMITER}${adventure.getCombatantIndex(user)}`, "levelsGained", "loot", 1);
			resultLines.push(`${user.name} gains a level.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Double Longsword")
	.setCooldown(2)
	.setDamage(40)
	.setBonus(75);
