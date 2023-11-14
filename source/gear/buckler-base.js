const { GearTemplate } = require('../classes');
const { addBlock, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Buckler",
	"Grant an ally @{block} block and gain @{mod0Stacks} @{mod0}",
	"Block x@{critMultiplier}",
	"Armor",
	"Earth",
	200,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [powerUp], block, critMultiplier } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			block *= critMultiplier;
		}
		addBlock(target, block);
		addModifier(user, powerUp);
		return `Damage will be Blocked for ${target.getName(adventure.room.enemyIdMap)}. ${user.getName(adventure.room.enemyIdMap)} is Powered Up.`;
	}
).setTargetingTags({ target: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Devoted Buckler", "Guarding Buckler", "Reinforced Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setBlock(75);
