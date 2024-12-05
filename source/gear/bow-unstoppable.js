const { GearTemplate } = require('../classes/index.js');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
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
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, true, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Evasive Bow", "Thief's Bow")
	.setCooldown(1)
	.setDamage(40)
	.setPriority(1);
