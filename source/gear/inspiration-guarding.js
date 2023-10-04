const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier, removeModifier, addBlock } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Guarding Inspiration",
	"Apply @{mod1Stacks} @{mod1} and @{block} block to an ally",
	"@{mod1} +@{bonus}",
	"Spell",
	"Wind",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, powerUp], bonus, block } = module.exports;
		const pendingPowerUp = { ...powerUp, stacks: powerUp.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			removeModifier(target, elementStagger);
		}
		addModifier(target, pendingPowerUp);
		addBlock(target, block);
		return `${target.getName(adventure.room.enemyIdMap)} is Powered Up and prepared to Block.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Soothing Inspiration", "Sweeping Inspiration")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setBonus(25) // Power Up stacks
	.setBlock(25)
	.setDurability(10);
