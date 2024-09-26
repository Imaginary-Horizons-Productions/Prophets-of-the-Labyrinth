const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Soothing Inspiration",
	[
		["use", "Apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to an ally"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
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
		const resultLines = [];
		const poweredUpTargets = addModifier(targets, pendingPowerUp);
		if (poweredUpTargets.length > 0) {
			resultLines.push(joinAsStatement(false, poweredUpTargets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Power Up")}.`));
		}
		const regenedTargets = addModifier(targets, regen);
		if (regenedTargets.length > 0) {
			resultLines.push(joinAsStatement(false, regenedTargets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Regen")}.`));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 }, { name: "Regen", stacks: 2 })
	.setBonus(25) // Power Up stacks
	.setDurability(10);
