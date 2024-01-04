const { GearTemplate } = require('../classes');
const { addBlock, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Devoted Buckler",
	"Grant an ally @{block} block and @{mod0Stacks} @{mod0}",
	"Block x@{critMultiplier}",
	"Armor",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], block, critMultiplier } = module.exports;
		let pendingBlock = block;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingBlock *= critMultiplier;
		}
		addBlock(target, pendingBlock);
		const addedPowerUp = addModifier(target, powerUp);
		const targetName = target.getName(adventure.room.enemyIdMap);
		return `Damage will be Blocked for ${targetName}.${addedPowerUp ? ` ${targetName} is Powered Up.` : ""}`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Buckler", "Reinforced Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setBlock(75);
