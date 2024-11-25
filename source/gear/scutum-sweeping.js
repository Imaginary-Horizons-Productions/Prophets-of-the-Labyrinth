const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_ALLY } = require('../constants');
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
		const { element, protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger([user, ...targets], user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		addProtection([user, ...targets], pendingProtection);
		return ["Everyone gains protection."];
	}
).setTargetingTags({ type: "all", team: "ally" })
	.setSidegrades("Guarding Scutum", "Lucky Scutum")
	.setDurability(15)
	.setProtection(75);
