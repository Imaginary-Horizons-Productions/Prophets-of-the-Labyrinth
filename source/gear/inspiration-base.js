const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier, removeModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Inspiration",
	"Apply @{mod1Stacks} @{mod1} to an ally",
	"@{mod1} +@{bonus}",
	"Spell",
	"Wind",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, powerUp], bonus } = module.exports;
		const pendingPowerUp = { ...powerUp, stacks: powerUp.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			removeModifier(target, elementStagger);
		}
		addModifier(target, pendingPowerUp);
		return `${target.getName(adventure.room.enemyIdMap)} is Powered Up.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setUpgrades("Guarding Inspiration", "Soothing Inspiration", "Sweeping Inspiration")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setBonus(25) // Power Up stacks
	.setDurability(10);
