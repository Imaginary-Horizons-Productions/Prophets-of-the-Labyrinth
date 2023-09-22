const { GearTemplate } = require('../classes');
// const { addBlock, removeModifier, addModifier } = require('../combatantDAO.js');

module.exports = new GearTemplate("Heavy Buckler",
	"Grant an ally @{block} block and gain @{mod1Stacks} @{mod1}",
	"Block x@{critBonus}",
	"Armor",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, powerUp], block, critBonus } = module.exports;
		if (user.element === element) {
			removeModifier(target, elementStagger);
		}
		if (isCrit) {
			block *= critBonus;
		}
		addBlock(target, block);
		addModifier(user, powerUp);
		return `Damage will be Blocked for ${target.getName(adventure.room.enemyIdMap)}. ${user.getName(adventure.room.enemyIdMap)} is Powered Up.`;
	}
).setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Devoted Buckler", "Guarding Buckler")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setDurability(15)
	.setBlock(125);
