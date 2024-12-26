const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { gainHealth, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Second Wind",
	[
		["use", "Regain @{damage} HP"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Technique",
	"Unaligned",
	200,
	(targets, user, adventure) => {
		const { essence, critMultiplier } = module.exports;
		let pendingHealing = user.getPower();
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		return [gainHealth(user, pendingHealing, adventure)];
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setUpgrades("Cleansing Second Wind", "Balanced Second Wind", "Soothing Second Wind")
	.setCooldown(2)
	.setDamage(0);
