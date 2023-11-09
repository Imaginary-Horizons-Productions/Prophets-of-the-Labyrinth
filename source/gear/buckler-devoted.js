const { GearTemplate } = require('../classes');
const { addBlock, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Devoted Buckler",
	"Grant an ally @{block} block and @{mod0Stacks} @{mod0}",
	"Block x@{critBonus}",
	"Armor",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [powerUp], block, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			block *= critBonus;
		}
		addBlock(target, block);
		addModifier(target, powerUp);
		const targetName = target.getName(adventure.room.enemyIdMap);
		return `Damage will be Blocked for ${targetName}. ${user.getName(adventure.room.enemyIdMap)} and ${targetName} are Powered Up.`;
	}
).setTargetingTags({ target: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Buckler", "Reinforced Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setBlock(75);
