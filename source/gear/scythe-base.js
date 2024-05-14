const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Scythe",
	"Strike a foe for @{damage} @{element} damage; instant death if foe is at or below @{bonus} hp",
	"Instant death threshold x@{critMultiplier}",
	"Weapon",
	"Darkness",
	200,
	([target], user, isCrit, adventure) => {
		const { element, damage, bonus: hpThreshold, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingHPThreshold = hpThreshold;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (isCrit) {
			pendingHPThreshold *= critMultiplier;
		}
		if (target.hp > pendingHPThreshold) {
			return dealDamage([target], user, pendingDamage, false, element, adventure);
		} else {
			target.hp = 0;
			return `${getNames([target], adventure)[0]} meets the reaper.`;
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Lethal Scythe", "Toxic Scythe", "Unstoppable Scythe")
	.setDurability(15)
	.setDamage(40)
	.setBonus(99); // execute threshold
