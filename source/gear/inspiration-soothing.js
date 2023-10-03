const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier, removeModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Soothing Inspiration",
	"Apply @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2} to an ally",
	"@{mod1} +@{bonus}",
	"Spell",
	"Wind",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, powerUp, regen], bonus } = module.exports;
		const pendingPowerUp = { ...powerUp, stacks: powerUp.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			removeModifier(target, elementStagger);
		}
		addModifier(target, pendingPowerUp);
		addModifier(target, regen);
		return `${target.getName(adventure.room.enemyIdMap)} is Powered Up and gains Regen.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Reinforcing Inspiration", "Sweeping Inspiration")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }, { name: "Regen", stacks: 2 }])
	.setBonus(25) // Power Up stacks
	.setDurability(10);
