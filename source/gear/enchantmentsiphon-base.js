const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addProtection } = require('../util/combatantUtil');

module.exports = new GearTemplate("Enchantment Siphon",
	[
		["use", "Remove a single foe's protection, gain <@{protection} + removed protection> protection"],
		["Critical💥", "Protection x @{critMultiplier}"]
	],
	"Defense",
	"Wind",
	200,
	([target], user, adventure) => {
		const { essence, protection, critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const stolenProtection = target.protection;
		target.protection = 0;
		let pendingProtection = protection + Math.floor(user.getMaxHP() / 5) + stolenProtection;
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([user], pendingProtection);
		if (stolenProtection > 0) {
			return [`${user.name} steals ${target.name}'s protection.`];
		} else {
			return [`${user.name} gains protection.`];
		}
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Flanking Enchantment Siphon", "Tormenting Enchantment Siphon")
	.setCooldown(1)
	.setProtection(0);
