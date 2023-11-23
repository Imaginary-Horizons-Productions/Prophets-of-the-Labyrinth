const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Hunter's Bow",
	"Strike a foe for @{damage} @{element} damage with priority, gain @{bonus}g on kill",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Wind",
	350,
	([target], user, isCrit, adventure) => {
		const { element, damage, bonus: bonusBounty, critMultiplier } = module.exports;
		let pendingDamage = damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		let damageText = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (target.hp < 1) {
			adventure.gainGold(bonusBounty);
			damageText += ` ${user.getName(adventure.room.enemyIdMap)} forages ${bonusBounty}g of hunting trophies.`;
		}
		return damageText;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Evasive Bow", "Mercurial Bow")
	.setDurability(15)
	.setDamage(75)
	.setBonus(15) // gold
	.setPriority(1);
