const { GearTemplate } = require('../classes/index.js');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Unstoppable Scythe",
	"Strike a foe for @{damage} @{element} unblockable damage, even while Stunned; instant death if foe is at or below @{bonus} hp",
	"Instant death threshold x@{critBonus}",
	"Weapon",
	"Darkness",
	350,
	([target], user, isCrit, adventure) => {
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
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Scythe", "Toxic Scythe")
	.setDurability(15)
	.setDamage(75)
	.setBonus(99); // execute threshold
