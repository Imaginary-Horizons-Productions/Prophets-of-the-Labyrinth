const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier, removeModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sweeping Inspiration",
	"Apply @{mod1Stacks} @{mod1} to all allies",
	"@{mod1} +@{bonus}",
	"Spell",
	"Wind",
	350,
	needsLivingTargets((targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, powerUp], bonus } = module.exports;
		const pendingPowerUp = { ...powerUp, stacks: powerUp.stacks + (isCrit ? bonus : 0) };
		targets.forEach(target => {
			if (user.element === element) {
				removeModifier(target, elementStagger);
			}
			addModifier(target, pendingPowerUp);
		})
		return `Everyone is Powered Up.`;
	})
).setTargetingTags({ target: "all", team: "delver" })
	.setSidegrades("Guarding Inspiration", "Soothing Inspiration")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setBonus(25) // Power Up stacks
	.setDurability(10);
