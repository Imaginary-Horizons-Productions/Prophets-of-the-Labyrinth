const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Hunter's Sickle",
	"Strike a foe for @{damage} (+5% foe max hp) @{element} damage, gain @{bonus}g on kill",
	"Damage x@{critBonus}",
	"Weapon",
	"Water",
	350,
	([target], user, isCrit, adventure) => {
		let { element, damage, critBonus, bonus: bonusBounty } = module.exports;
		damage += (0.05 * target.maxHP);
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critBonus;
		}
		let damageText = dealDamage([target], user, damage, false, element, adventure);
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
