const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Hunter's Bow",
	"Strike a foe for @{damage} @{element} damage with priority, gain @{bonus}g on kill",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, bonus: bonusBounty, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		let resultText = dealDamage(targets, user, pendingDamage, false, element, adventure);
		let hunts = 0;
		targets.forEach(target => {
			if (target.hp < 1) {
				hunts++;
			}
		})
		const totalGold = bonusBounty * hunts;
		if (totalGold > 0) {
			adventure.gainGold(totalGold);
			resultText += ` ${getNames([user], adventure)[0]} forages ${totalGold}g of hunting trophies.`;
		}
		return resultText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Evasive Bow", "Unstoppable Bow")
	.setDurability(15)
	.setDamage(40)
	.setBonus(30) // gold
	.setPriority(1);
