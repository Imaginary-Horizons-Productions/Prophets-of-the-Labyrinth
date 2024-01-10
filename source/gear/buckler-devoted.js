const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Devoted Buckler",
	"Grant an ally @{protection} protection and @{mod0Stacks} @{mod0}",
	"Protection x@{critMultiplier}",
	"Armor",
	"Earth",
	350,
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
		const addedPowerUp = addModifier(target, powerUp);
		const targetName = target.getName(adventure.room.enemyIdMap);
		return `${targetName} gains protection.${addedPowerUp ? ` ${targetName} is Powered Up.` : ""}`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Buckler", "Reinforced Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setProtection(75);
