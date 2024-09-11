const { GearTemplate } = require('../classes');
const { gainHealth, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Second Wind",
	"Regain @{damage} hp",
	"Healing x@{critMultiplier}",
	"Technique",
	"Untyped",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, critMultiplier } = module.exports;
		let pendingHealing = user.getPower();
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		return gainHealth(user, pendingHealing, adventure);
	}
).setTargetingTags({ type: "self", team: "none", needsLivingTargets: true })
	.setUpgrades("Cleansing Second Wind", "Lucky Second Wind", "Soothing Second Wind")
	.setDurability(10)
	.setDamage(0);
