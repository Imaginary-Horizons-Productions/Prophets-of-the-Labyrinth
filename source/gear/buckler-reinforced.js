const { GearTemplate } = require('../classes');
const { addBlock, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Reinforced Buckler",
	"Grant @{block} block to an ally and yourself and gain @{mod0Stacks} @{mod0}",
	"Block x@{critMultiplier}",
	"Armor",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], block, critMultiplier } = module.exports;
		let pendingBlock = block;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingBlock *= critMultiplier;
		}
		addBlock(target, pendingBlock);
		addBlock(user, pendingBlock);
		const addedPowerUp = addModifier(user, powerUp);
		const userName = user.getName(adventure.room.enemyIdMap);
		return `Damage will be Blocked for ${target.getName(adventure.room.enemyIdMap)} and ${userName}.${addedPowerUp ? ` ${userName} is Powered Up.` : ""}`;
	}
).setTargetingTags({ target: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Devoted Buckler", "Guarding Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setBlock(75);
