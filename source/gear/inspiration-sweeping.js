const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sweeping Inspiration",
	[
		["use", "Apply @{mod0Stacks} @{mod0} to all allies"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], bonus } = module.exports;
		const pendingPowerUp = { ...powerUp };
		if (isCrit) {
			pendingPowerUp.stacks += bonus;
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingPowerUp)));
	}
).setTargetingTags({ type: "all", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Inspiration", "Soothing Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setBonus(25) // Power Up stacks
	.setDurability(10);
