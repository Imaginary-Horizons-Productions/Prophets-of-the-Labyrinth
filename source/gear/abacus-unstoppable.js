const { GearTemplate } = require('../classes/index.js');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Unstoppable Abacus",
	"Strike a foe for @{damage} (+5% foe max hp) @{element} unblockable damage",
	"Damage x@{critMultiplier}",
	"Trinket",
	"Water",
	350,
	([target], user, isCrit, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage + (0.05 * target.getMaxHP());
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, pendingDamage, true, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Hunter's Abacus", "Sharpened Abacus")
	.setDurability(15)
	.setDamage(40);
