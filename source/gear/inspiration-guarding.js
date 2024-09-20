const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, addProtection, getNames } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Guarding Inspiration",
	[
		["use", "Apply @{mod0Stacks} @{mod0} and @{protection} protection to an ally"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
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
		const resultLines = [joinAsStatement(false, getNames(targets, adventure), "gains", "gain", "protection.")];
		if (poweredUpTargets.length > 0) {
			resultLines.push(joinAsStatement(false, poweredUpTargets, "gains", "gain", `${getApplicationEmojiMarkdown("Power Up")}.`));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Soothing Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setBonus(25) // Power Up stacks
	.setProtection(25)
	.setDurability(10);
