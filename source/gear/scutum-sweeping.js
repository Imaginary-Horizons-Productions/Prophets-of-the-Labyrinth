const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection } = require('../util/combatantUtil');

module.exports = new GearTemplate("Sweeping Scutum",
	[
		["use", "Grant @{protection} protection to all allies (including yourself)"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Armor",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { essence, protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		if (user.essence === essence) {
			changeStagger([user, ...targets], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		addProtection([user, ...targets], pendingProtection);
		return ["Everyone gains protection."];
	}
).setTargetingTags({ type: "all", team: "ally" })
	.setSidegrades("Guarding Scutum", "Lucky Scutum")
	.setCooldown(1)
	.setProtection(75);
