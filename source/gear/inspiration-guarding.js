const { GearTemplate } = require('../classes');
const { addModifier, addBlock } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Guarding Inspiration",
	"Apply @{mod0Stacks} @{mod0} and @{block} block to an ally",
	"@{mod0} +@{bonus}",
	"Spell",
	"Wind",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], bonus, block } = module.exports;
		const pendingPowerUp = { ...powerUp };
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingPowerUp.stacks += bonus;
		}
		const addedPowerUp = addModifier(target, pendingPowerUp);
		addBlock(target, block);
		return `${target.getName(adventure.room.enemyIdMap)} is${addedPowerUp ? ` Powered Up and` : ""} prepared to Block.`;
	}
).setTargetingTags({ target: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Soothing Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setBonus(25) // Power Up stacks
	.setBlock(25)
	.setDurability(10);
