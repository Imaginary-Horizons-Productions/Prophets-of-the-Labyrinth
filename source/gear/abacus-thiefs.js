const { GearTemplate } = require('../classes/index.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thief's Abacus",
	[
		["use", "Deal <@{damage} + 5% target max HP> @{element} damage to a foe, gain @{bonus}g on kill"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, adventure) => {
		const { element, damage, critMultiplier, bonus: bonusBounty } = module.exports;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const resultLines = [];
		let hunts = 0;
		targets.forEach(target => {
			let pendingDamage = user.getPower() + damage + (0.05 * target.getMaxHP());
			if (user.crit) {
				pendingDamage *= critMultiplier;
			}
			resultLines.push(...dealDamage([target], user, pendingDamage, false, element, adventure));
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
	.setDurability(15)
	.setDamage(40)
	.setBonus(30); // gold
