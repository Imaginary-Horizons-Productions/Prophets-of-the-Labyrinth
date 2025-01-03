const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_ALLY } = require('../constants.js');
const { addModifier, changeStagger, addProtection, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Guarding Inspiration",
	[
		["use", "Apply @{mod0Stacks} @{mod0} and @{protection} protection to an ally"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [powerUp], bonus, protection } = module.exports;
		const pendingPowerUp = { ...powerUp };
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingPowerUp.stacks += bonus;
		}
		addProtection(targets, protection);
		return [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection."), ...generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingPowerUp)))];
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Soothing Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setBonus(25) // Power Up stacks
	.setProtection(25)
	.setCharges(10);
