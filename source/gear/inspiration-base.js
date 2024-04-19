const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Inspiration",
	"Apply @{mod0Stacks} @{mod0} to an ally",
	"@{mod0} +@{bonus}",
	"Spell",
	"Wind",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], bonus } = module.exports;
		const pendingPowerUp = { ...powerUp };
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (isCrit) {
			pendingPowerUp.stacks += bonus;
		}
		const poweredUpTargets = addModifier(targets, pendingPowerUp);
		if (poweredUpTargets.length > 0) {
			return joinAsStatement(false, getNames(poweredUpTargets, adventure), "is", "are", "Powered Up.");
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Guarding Inspiration", "Soothing Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setBonus(25) // Power Up stacks
	.setDurability(10);
