const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Scutum",
	"Grant @{protection} protection to an ally and yourself",
	"Protection x@{critMultiplier}",
	"Armor",
	"Fire",
	200,
	([target], user, isCrit, adventure) => {
		const { element, protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		target.protection += pendingProtection;
		user.protection += pendingProtection;
		return `${target.getName(adventure.room.enemyIdMap)} and ${user.getName(adventure.room.enemyIdMap)} gain protection.`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Guarding Scutum", "Sweeping Scutum", "Vigilant Scutum")
	.setDurability(15)
	.setProtection(75);
