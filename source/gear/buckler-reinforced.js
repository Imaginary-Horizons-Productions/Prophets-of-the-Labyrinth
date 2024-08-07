const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, addProtection, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Reinforced Buckler",
	"Grant @{protection} protection to an ally and yourself and gain @{mod0Stacks} @{mod0}",
	"Protection x@{critMultiplier}",
	"Armor",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger([user, ...targets], "elementMatchAlly");
		}
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([user, ...targets], pendingProtection);
		const addedPowerUp = addModifier([user], powerUp).length > 0;
		const [userName, ...targetNames] = getNames([user, ...targets], adventure);
		return `${joinAsStatement(false, [...targetNames, userName], "gains", "gain", "protection.")}${addedPowerUp ? ` ${userName} is Powered Up.` : ""}`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Devoted Buckler", "Guarding Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setProtection(75);
