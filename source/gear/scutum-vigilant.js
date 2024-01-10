const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Vigilant Scutum",
	"Grant @{protection} protection to an ally and yourself and gain @{mod0Stacks} @{mod0}",
	"Protection x@{critMultiplier}",
	"Armor",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [vigilance], protection, critMultiplier } = module.exports;
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
		const addedVigilance = addModifier(user, vigilance);
		const userName = user.getName(adventure.room.enemyIdMap);
		return `${target.getName(adventure.room.enemyIdMap)} and ${userName} gain protection.${addedVigilance ? ` ${userName} gains Vigilance.` : ""}`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Scutum", "Sweeping Scutum")
	.setModifiers({ name: "Vigilance", stacks: 1 })
	.setDurability(15)
	.setProtection(75);
