const { GearTemplate } = require('../classes/index.js');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thief's Abacus",
	[
		["use", "Deal <@{damage} + 5% target max HP> @{essence} damage to a foe, gain @{bonus}g on kill"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, damage, critMultiplier, bonus: bonusBounty } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = [];
		let hunts = 0;
		targets.forEach(target => {
			let pendingDamage = user.getPower() + damage + (0.05 * target.getMaxHP());
			if (user.crit) {
				pendingDamage *= critMultiplier;
			}
			resultLines.push(...dealDamage([target], user, pendingDamage, false, essence, adventure));
			if (target.hp < 1) {
				hunts++;
			}
		})
		const totalGold = bonusBounty * hunts;
		if (totalGold > 0) {
			adventure.gainGold(totalGold);
			resultLines.push(`${user.name} harvests ${totalGold}g of alchemical reagents.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Sharpened Abacus", "Unstoppable Abacus")
	.setCooldown(1)
	.setDamage(40)
	.setBonus(30); // gold
