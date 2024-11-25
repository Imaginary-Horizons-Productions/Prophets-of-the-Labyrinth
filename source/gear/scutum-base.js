const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_ALLY } = require('../constants');
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
		const { element, protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger([target, user], user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([target, user], pendingProtection);
		return [`${target.name} and ${user.name} gain protection.`];
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setUpgrades("Guarding Scutum", "Lucky Scutum", "Sweeping Scutum")
	.setDurability(15)
	.setProtection(75);
