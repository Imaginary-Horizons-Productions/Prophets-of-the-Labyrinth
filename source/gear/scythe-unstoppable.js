const { GearTemplate } = require('../classes/index.js');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Unstoppable Scythe",
	"Strike a foe for @{damage} @{element} unblockable damage, even while Stunned; instant death if foe is at or below @{bonus} hp",
	"Instant death threshold x@{critMultiplier}",
	"Weapon",
	"Darkness",
	350,
	([target], user, isCrit, adventure) => {
		const { element, damage, bonus: hpThreshold, critMultiplier } = module.exports;
		let pendingHPThreshold = hpThreshold;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingHPThreshold *= critMultiplier;
		}
		if (target.hp > pendingHPThreshold) {
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
