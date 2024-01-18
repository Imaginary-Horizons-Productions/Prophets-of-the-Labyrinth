const { GearTemplate } = require('../classes/index.js');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Hunter's Abacus",
	"Deal @{damage} (+5% foe max hp) @{element} damage to a foe, gain @{bonus}g on kill",
	"Damage x@{critMultiplier}",
	"Trinket",
	"Water",
	350,
	([target], user, isCrit, adventure) => {
		const { element, damage, critMultiplier, bonus: bonusBounty } = module.exports;
		let pendingDamage = user.getPower() + damage + (0.05 * target.getMaxHP());
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		let damageText = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (target.hp < 1) {
			adventure.gainGold(bonusBounty);
			damageText += ` ${user.getName(adventure.room.enemyIdMap)} harvests ${bonusBounty}g of alchemical reagents.`;
		}
		return damageText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Sharpened Abacus", "Toxic Abacus")
	.setDurability(15)
	.setDamage(40)
	.setBonus(15); // gold
