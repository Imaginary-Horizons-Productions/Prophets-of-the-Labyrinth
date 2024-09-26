const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Inspiration",
	[
		["use", "Apply @{mod0Stacks} @{mod0} to an ally"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
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
			return [joinAsStatement(false, poweredUpTargets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Power Up")}.`)];
		} else {
			return [];
		}
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Guarding Inspiration", "Soothing Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setBonus(25) // Power Up stacks
	.setDurability(10);
