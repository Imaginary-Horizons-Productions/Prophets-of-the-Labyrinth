const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_ALLY } = require('../constants.js');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Soothing Inspiration",
	[
		["use", "Apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to an ally"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [powerUp, regen], bonus } = module.exports;
		const pendingPowerUp = { ...powerUp };
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingPowerUp.stacks += bonus;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingPowerUp).concat(addModifier(targets, regen))));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Guarding Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 }, { name: "Regen", stacks: 2 })
	.setBonus(25) // Power Up stacks
	.setDurability(10);
