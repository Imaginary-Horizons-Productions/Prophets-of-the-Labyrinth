const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, addProtection, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Buckler",
	"Grant an ally @{protection} protection and gain @{mod0Stacks} @{mod0}",
	"Protection x@{critMultiplier}",
	"Armor",
	"Earth",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		addProtection(targets, pendingProtection);
		const addedPowerUp = addModifier([user], powerUp).length > 0;
		return `${joinAsStatement(false, getNames(targets, adventure), "gains", "gain", "protection.")}${addedPowerUp ? ` ${getNames([user], adventure)[0]} is Powered Up.` : ""}`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Devoted Buckler", "Guarding Buckler", "Reinforced Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setProtection(75);
