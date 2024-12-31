const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Thief's Battle Standard",
	[
		["use", "Deal @{damage} @{essence} damage to a single foe, gain @{bonus2}g if they're downed"],
		["Critical💥", "Damage x @{critMultiplier}, gain @{bonus} Morale"]
	],
	"Offense",
	"Light",
	350,
	(targets, user, adventure) => {
		const { essence, damage, bonus, bonus2 } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		const resultLines = [];
		if (user.crit) {
			pendingDamage *= critMultiplier;
			adventure.room.morale += bonus;
			resultLines.push("The party's Morale is increased!")
		}
		resultLines.unshift(...dealDamage(targets, user, pendingDamage, false, essence, adventure));
		let killCount = 0;
		targets.forEach(target => {
			if (target.hp < 1) {
				killCount++
			}
		})
		if (killCount > 0) {
			const totalBounty = killCount * bonus2;
			adventure.room.addResource("Gold", "Currency", "loot", totalBounty);
			resultLines.push(`${user.name} pillages ${totalBounty}g.`);
		}

		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Tormenting Battle Standard")
	.setCooldown(1)
	.setDamage(40)
	.setBonus(1) // Morale
	.setBonus2(30); // Bounty
