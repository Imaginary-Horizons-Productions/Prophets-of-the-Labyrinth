const { GearTemplate } = require('../classes');
const { addBlock, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Barrier",
	"Gain @{block} block and @{mod0Stacks} @{mod0}",
	"@{mod0} x@{critMultiplier}",
	"Spell",
	"Earth",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [vigilance], block, critMultiplier } = module.exports;
		const pendingVigilance = { ...vigilance };
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingVigilance.stacks *= critMultiplier;
		}
		const addedVigilance = addModifier(user, pendingVigilance);
		addBlock(user, block);
		return `${user.getName(adventure.room.enemyIdMap)}${addedVigilance ? " Vigilantly" : ""} prepares to Block.`;
	}
).setTargetingTags({ target: "self", team: "any", needsLivingTargets: false })
	.setUpgrades("Cleansing Barrier", "Devoted Barrier", "Long Barrier")
	.setModifiers({ name: "Vigilance", stacks: 1 })
	.setDurability(5)
	.setBlock(999);
