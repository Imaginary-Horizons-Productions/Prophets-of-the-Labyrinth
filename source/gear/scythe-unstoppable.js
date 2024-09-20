const { GearTemplate } = require('../classes/index.js');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Unstoppable Scythe",
	[
		["use", "Strike a foe for @{damage} @{element} unblockable damage, even while Stunned; instant death if foe is at or below @{bonus} HP"],
		["Critical💥", "Instant death threshold x@{critMultiplier}"]
	],
	"Weapon",
	"Darkness",
	350,
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
			return dealDamage([target], user, pendingDamage, true, element, adventure);
		} else {
			target.hp = 0;
			return [`${getNames([target], adventure)[0]} meets the reaper.`];
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Scythe", "Toxic Scythe")
	.setDurability(15)
	.setDamage(40)
	.setBonus(99); // execute threshold
