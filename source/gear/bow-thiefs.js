const { GearTemplate } = require('../classes/index.js');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thief's Bow",
	[
		["use", "Strike a foe for @{damage} @{element} damage with priority, gain @{bonus}g on kill"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element, damage, bonus: bonusBounty, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
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
			resultLines.push(`${user.name} forages ${totalGold}g of hunting trophies.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Evasive Bow", "Unstoppable Bow")
	.setCooldown(1)
	.setDamage(40)
	.setBonus(30) // gold
	.setPriority(1);
