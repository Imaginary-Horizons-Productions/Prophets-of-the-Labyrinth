const { GearTemplate } = require('../classes/index.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Unstoppable Bow",
	[
		["use", "Strike a foe for @{damage} unblockable @{element} damage with priority, even while Stunned"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, true, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Evasive Bow", "Thief's Bow")
	.setDurability(15)
	.setDamage(40)
	.setPriority(1);
