const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Piercing Scythe",
	"Strike a foe for @{damage} @{element} unblockable damage; instant death if foe is at or below @{bonus} hp",
	"Instant death threshold x@{critBonus}",
	"Weapon",
	"Darkness",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, damage, bonus: hpThreshold, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			hpThreshold *= critBonus;
		}
		if (target.hp > hpThreshold) {
			return dealDamage([target], user, damage, true, element, adventure);
		} else {
			target.hp = 0;
			return `${target.getName(adventure.room.enemyIdMap)} meets the reaper.`;
		}
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Lethal Scythe", "Toxic Scythe")
	.setDurability(15)
	.setDamage(75)
	.setBonus(99); // execute threshold
