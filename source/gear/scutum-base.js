const { GearTemplate } = require('../classes');
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
			changeStagger([target, user], "elementMatchAlly");
		}
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([target, user], pendingProtection);
		return [`${target.name} and ${user.name} gain protection.`];
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Guarding Scutum", "Lucky Scutum", "Sweeping Scutum")
	.setDurability(15)
	.setProtection(75);
