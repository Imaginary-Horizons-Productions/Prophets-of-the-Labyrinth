const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sweeping Inspiration",
	"Apply @{mod0Stacks} @{mod0} to all allies",
	"@{mod0} +@{bonus}",
	"Spell",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [powerUp], bonus } = module.exports;
		const pendingPowerUp = { ...powerUp, stacks: powerUp.stacks + (isCrit ? bonus : 0) };
		targets.forEach(target => {
			if (user.element === element) {
				target.addStagger("elementMatchAlly");
			}
			addModifier(target, pendingPowerUp);
		})
		return `Everyone is Powered Up.`;
	}
).setTargetingTags({ target: "all", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Inspiration", "Soothing Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setBonus(25) // Power Up stacks
	.setDurability(10);
