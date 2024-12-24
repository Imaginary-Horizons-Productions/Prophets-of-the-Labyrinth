const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection } = require('../util/combatantUtil');

module.exports = new GearTemplate("Scutum",
	[
		["use", "Grant @{protection} protection to an ally and yourself"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Armor",
	"Fire",
	200,
	([target], user, adventure) => {
		const { essence, protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.essence === essence) {
			changeStagger([target, user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([target, user], pendingProtection);
		return [`${target.name} and ${user.name} gain protection.`];
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setUpgrades("Guarding Scutum", "Lucky Scutum", "Sweeping Scutum")
	.setCooldown(1)
	.setProtection(75);
