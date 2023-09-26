const { GearTemplate, Resource } = require('../classes');
// const { generateRandomNumber } = require('../../helpers.js');
// const { removeModifier } = require('../combatantDAO.js');

const rollablePotions = [
	"Block Potion",
	"Clear Potion",
	"Earthen Potion",
	"Explosive Potion",
	"Fiery Potion",
	"Glowing Potion",
	"Health Potion",
	"Inky Potion",
	"Watery Potion",
	"Windy Potion"
];


module.exports = new GearTemplate("Organic Potion Kit",
	"Add 1 random potion to loot, regain 1 durability when entering a new room",
	"Instead add @{critBonus} potions",
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], critBonus } = module.exports;
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		const randomPotion = rollablePotions[generateRandomNumber(adventure, rollablePotions.length, "battle")];
		if (isCrit) {
			adventure.addResource(new Resource(randomPotion, "item", "loot", critBonus));
			return `${user.getName(adventure.room.enemyIdMap)} sets a double-batch of ${randomPotion} simmering.`;
		} else {
			adventure.addResource(new Resource(randomPotion, "item", "loot", 1));
			return `${user.getName(adventure.room.enemyIdMap)} sets a batch of ${randomPotion} simmering.`;
		}
	}
).setTargetingTags({ target: "none", team: "none" })
	.setSidegrades("Guarding Potion Kit", "Urgent Potion Kit")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability(15)
	.setFlavorText({ name: "Possible Potions", value: rollablePotions.join(", ") });
