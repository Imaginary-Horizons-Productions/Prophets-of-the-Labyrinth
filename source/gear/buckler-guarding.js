const { GearTemplate } = require('../classes');
const { addBlock, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Guarding Buckler",
	"Grant an ally @{block} block and gain @{mod0Stacks} @{mod0}",
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
		const addedPowerUp = addModifier(user, powerUp);
		return `Damage will be Blocked for ${target.getName(adventure.room.enemyIdMap)}.${addedPowerUp ? ` ${user.getName(adventure.room.enemyIdMap)} is Powered Up.` : ""}`;
	}
).setTargetingTags({ target: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Devoted Buckler", "Reinforced Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setBlock(125);
