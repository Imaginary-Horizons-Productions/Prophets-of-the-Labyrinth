const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, addProtection, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Devoted Buckler",
	"Grant an ally @{protection} protection and @{mod0Stacks} @{mod0}",
	"Protection x@{critMultiplier}",
	"Armor",
	"Earth",
	350,
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
		const poweredUpTargets = addModifier(targets, powerUp);
		const targetNames = getNames(targets, adventure);
		return `${joinAsStatement(false, targetNames, "gains", "gain", "protection.")}${poweredUpTargets.length > 0 ? ` ${joinAsStatement(false, getNames(poweredUpTargets, adventure), "is", "are", "Powered Up.")}` : ""}`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Buckler", "Reinforced Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setProtection(75);
