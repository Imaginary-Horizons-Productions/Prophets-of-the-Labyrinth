const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Buckler",
	"Grant an ally @{protection} protection and gain @{mod0Stacks} @{mod0}",
	"Protection x@{critMultiplier}",
	"Armor",
	"Earth",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		target.protection += pendingProtection;
		const addedPowerUp = addModifier(user, powerUp);
		return `${target.getName(adventure.room.enemyIdMap)} gains protection.${addedPowerUp ? ` ${user.getName(adventure.room.enemyIdMap)} is Powered Up.` : ""}`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Devoted Buckler", "Guarding Buckler", "Reinforced Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setProtection(75);
