const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Hunter's Sickle",
	"Strike a foe for @{damage} (+5% foe max hp) @{element} damage, gain @{bonus}g on kill",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Water",
	350,
	([target], user, isCrit, adventure) => {
		const { element, damage, critMultiplier, bonus: bonusBounty } = module.exports;
		let pendingDamage = damage + (0.05 * target.getMaxHP());
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
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Sharpened Sickle", "Toxic Sickle")
	.setDurability(15)
	.setDamage(75)
	.setBonus(15); // gold
