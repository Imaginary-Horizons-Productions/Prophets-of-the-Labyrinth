const { GearTemplate } = require('../classes/Gear.js');
// const { addBlock, removeModifier, addModifier } = require('../combatantDAO.js');

module.exports = new GearTemplate("Buckler",
	"Grant an ally @{block} block and gain @{mod1Stacks} @{mod1}",
	"Block x@{critBonus}",
	"Armor",
	"Earth",
	200,
	effect
)
	.setTargetingTags({ target: "single", team: "delver" })
	.setUpgrades("Devoted Buckler", "Guarding Buckler", "Heavy Buckler")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setDurability(15)
	.setBlock(75);

function effect([target], user, isCrit, adventure) {
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
