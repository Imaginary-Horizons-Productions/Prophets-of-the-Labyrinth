const { GearTemplate } = require('../classes/index.js');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Hunter's Abacus",
	"Deal @{damage} (+5% foe max hp) @{element} damage to a foe, gain @{bonus}g on kill",
	"Damage x@{critMultiplier}",
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, critMultiplier, bonus: bonusBounty } = module.exports;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		let resultText = "";
		let hunts = 0;
		targets.forEach(target => {
			let pendingDamage = user.getPower() + damage + (0.05 * target.getMaxHP());
			if (isCrit) {
				pendingDamage *= critMultiplier;
			}
			resultText += dealDamage([target], user, pendingDamage, false, element, adventure);
			if (target.hp < 1) {
				hunts++;
			}
		})
		const totalGold = bonusBounty * hunts;
		if (totalGold > 0) {
			adventure.gainGold(totalGold);
			resultText += ` ${getNames([user], adventure)} harvests ${totalGold}g of alchemical reagents.`;
		}
		return resultText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Sharpened Abacus", "Unstoppable Abacus")
	.setDurability(15)
	.setDamage(40)
	.setBonus(15); // gold
