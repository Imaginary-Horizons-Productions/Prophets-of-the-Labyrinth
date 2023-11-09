const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Scythe",
	"Strike a foe for @{damage} @{element} damage; instant death if foe is at or below @{bonus} hp",
	"Instant death threshold x@{critBonus}",
	"Weapon",
	"Darkness",
	200,
	([target], user, isCrit, adventure) => {
		let { element, damage, bonus: hpThreshold, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			hpThreshold *= critBonus;
		}
		if (target.hp > hpThreshold) {
			return dealDamage([target], user, damage, false, element, adventure);
		} else {
			target.hp = 0;
			return `${target.getName(adventure.room.enemyIdMap)} meets the reaper.`;
		}
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Lethal Scythe", "Toxic Scythe", "Unstoppable Scythe")
	.setDurability(15)
	.setDamage(75)
	.setBonus(99); // execute threshold
