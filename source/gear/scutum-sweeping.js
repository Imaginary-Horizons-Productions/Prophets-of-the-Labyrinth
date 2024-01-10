const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Sweeping Scutum",
	"Grant @{protection} protection to all allies (including yourself)",
	"Protection x@{critMultiplier}",
	"Armor",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		user.protection += pendingProtection;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		targets.forEach(target => {
			if (user.element === element) {
				target.addStagger("elementMatchAlly");
			}
			target.protection += pendingProtection;
		})
		return "Everyone gains protection.";
	}
).setTargetingTags({ type: "all", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Scutum", "Vigilant Scutum")
	.setDurability(15)
	.setProtection(75);
