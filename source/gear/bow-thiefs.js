const { GearTemplate } = require('../classes/index.js');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thief's Bow",
	[
		["use", "Strike a foe for @{damage} @{element} damage with priority, gain @{bonus}g on kill"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
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
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		let hunts = 0;
		targets.forEach(target => {
			if (target.hp < 1) {
				hunts++;
			}
		})
		const totalGold = bonusBounty * hunts;
		if (totalGold > 0) {
			adventure.gainGold(totalGold);
			resultLines.push(`${getNames([user], adventure)[0]} forages ${totalGold}g of hunting trophies.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Evasive Bow", "Unstoppable Bow")
	.setDurability(15)
	.setDamage(40)
	.setBonus(30) // gold
	.setPriority(1);
