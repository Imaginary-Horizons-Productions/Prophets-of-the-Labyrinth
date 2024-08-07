const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, addProtection, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Guarding Inspiration",
	"Apply @{mod0Stacks} @{mod0} and @{protection} protection to an ally",
	"@{mod0} +@{bonus}",
	"Spell",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], bonus, protection } = module.exports;
		const pendingPowerUp = { ...powerUp };
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (isCrit) {
			pendingPowerUp.stacks += bonus;
		}
		const poweredUpTargets = addModifier(targets, pendingPowerUp);
		addProtection(targets, protection);
		if (poweredUpTargets.length > 0) {
			return `${joinAsStatement(false, getNames(targets, adventure), "gains", "gain", "protection.")} ${joinAsStatement(false, poweredUpTargets, "is", "are", "Powered Up.")}`;
		} else {
			return joinAsStatement(false, getNames(targets, adventure), "gains", "gain", "protection.");
		}
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Soothing Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setBonus(25) // Power Up stacks
	.setProtection(25)
	.setDurability(10);
