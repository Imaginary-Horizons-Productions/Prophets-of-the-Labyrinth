const { GearTemplate } = require('../classes');
const { changeStagger, addProtection } = require('../util/combatantUtil');

module.exports = new GearTemplate("Sweeping Scutum",
	[
		["use", "Grant @{protection} protection to all allies (including yourself)"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Armor",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger([user, ...targets], "elementMatchAlly");
		}
		addProtection([user, ...targets], pendingProtection);
		return ["Everyone gains protection."];
	}
).setTargetingTags({ type: "all", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Scutum", "Lucky Scutum")
	.setDurability(15)
	.setProtection(75);
