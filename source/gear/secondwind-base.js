const { GearTemplate } = require('../classes');
const { gainHealth, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Second Wind",
	[
		["use", "Regain @{damage} HP"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Technique",
	"Untyped",
	200,
	(targets, user, adventure) => {
		const { element, critMultiplier } = module.exports;
		let pendingHealing = user.getPower();
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		return [gainHealth(user, pendingHealing, adventure)];
	}
).setTargetingTags({ type: "self", team: "none", needsLivingTargets: true })
	.setUpgrades("Cleansing Second Wind", "Lucky Second Wind", "Soothing Second Wind")
	.setDurability(10)
	.setDamage(0);
