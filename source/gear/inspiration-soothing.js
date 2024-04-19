const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Soothing Inspiration",
	"Apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to an ally",
	"@{mod0} +@{bonus}",
	"Spell",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerUp, regen], bonus } = module.exports;
		const pendingPowerUp = { ...powerUp };
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (isCrit) {
			pendingPowerUp.stacks += bonus;
		}
		const sentences = [];
		const poweredUpTargets = addModifier(targets, pendingPowerUp);
		if (poweredUpTargets.length > 0) {
			sentences.push(joinAsStatement(false, getNames(poweredUpTargets), "is", "are", "Powered Up."));
		}
		const regenedTargets = addModifier(targets, regen);
		if (regenedTargets.length > 0) {
			sentences.push(joinAsStatement(false, getNames(regenedTargets), "gains", "gain", "Regen."));
		}
		if (sentences.length > 0) {
			return sentences.join(" ");
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 }, { name: "Regen", stacks: 2 })
	.setBonus(25) // Power Up stacks
	.setDurability(10);
