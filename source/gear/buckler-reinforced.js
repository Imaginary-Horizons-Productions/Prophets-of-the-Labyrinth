const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Reinforced Buckler",
	"Grant @{protection} protection to an ally and yourself and gain @{mod0Stacks} @{mod0}",
	"Protection x@{critMultiplier}",
	"Armor",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		target.protection += pendingProtection;
		user.protection += pendingProtection;
		const addedPowerUp = addModifier(user, powerUp);
		const userName = user.getName(adventure.room.enemyIdMap);
		return `${target.getName(adventure.room.enemyIdMap)} and ${userName} gain protection.${addedPowerUp ? ` ${userName} is Powered Up.` : ""}`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Devoted Buckler", "Guarding Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setProtection(75);
