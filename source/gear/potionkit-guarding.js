const { GearTemplate, Resource } = require('../classes');
// const { generateRandomNumber } = require('../../helpers.js');
// const { removeModifier, addBlock } = require('../combatantDAO.js');

const rollablePotions = [
	"Block Potion",
	"Earthen Potion",
	"Explosive Potion",
	"Fiery Potion",
	"Health Potion",
	"Watery Potion",
	"Windy Potion"
];

module.exports = new GearTemplate("Guarding Potion Kit",
	"Gain @{block} block and add 1 random potion to loot",
	"Instead add @{critBonus} potions",
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], block, critBonus } = module.exports;
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		const randomPotion = rollablePotions[generateRandomNumber(adventure, rollablePotions.length, "battle")];
		addBlock(user, block);
		if (isCrit) {
			adventure.addResource(new Resource(randomPotion, "item", "loot", critBonus));
			return `${user.getName(adventure.room.enemyIdMap)} prepares to Block and sets a double-batch of ${randomPotion} simmering.`;
		} else {
			adventure.addResource(new Resource(randomPotion, "item", "loot", 1));
			return `${user.getName(adventure.room.enemyIdMap)} prepares to Block and sets a batch of ${randomPotion} simmering.`;
		}
	}
).setTargetingTags({ target: "none", team: "none" })
	.setSidegrades("Organic Potion Kit", "Urgent Potion Kit")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability(15)
	.setBlock(75)
	.setFlavorText({ name: "Possible Potions", value: rollablePotions.join(", ") });
