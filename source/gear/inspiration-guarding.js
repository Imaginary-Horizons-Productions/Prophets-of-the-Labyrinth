const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, addProtection } = require('../util/combatantUtil.js');
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
		addProtection(targets, protection);
		return [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection."), ...addModifier(targets, pendingPowerUp)];
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Soothing Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setBonus(25) // Power Up stacks
	.setProtection(25)
	.setDurability(10);
