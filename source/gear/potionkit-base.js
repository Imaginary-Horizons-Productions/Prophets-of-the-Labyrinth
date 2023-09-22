const { GearTemplate } = require('../classes');
// const Resource = require('../../Classes/Resource.js');
// const { generateRandomNumber } = require('../../helpers.js');
// const { removeModifier } = require('../combatantDAO.js');

const rollablePotions = [
	"Block Potion",
	"Earthen Potion",
	"Explosive Potion",
	"Fiery Potion",
	"Health Potion",
	"Watery Potion",
	"Windy Potion"
];

module.exports = new GearTemplate("Potion Kit",
	"Add 1 random potion to loot",
	"Instead add @{critBonus} potions",
	"Trinket",
	"Water",
	200,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], critBonus } = module.exports;
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		const randomPotion = rollablePotions[generateRandomNumber(adventure, rollablePotions.length, "battle")];
		if (isCrit) {
			adventure.addResource(new Resource(randomPotion, "consumable", critBonus, "loot", 0));
			return `${user.getName(adventure.room.enemyIdMap)} sets a double-batch of ${randomPotion} simmering.`;
		} else {
			adventure.addResource(new Resource(randomPotion, "consumable", 1, "loot", 0));
			return `${user.getName(adventure.room.enemyIdMap)} sets a batch of ${randomPotion} simmering.`;
		}
	}
).setTargetingTags({ target: "none", team: "none" })
	.setUpgrades("Guarding Potion Kit", "Organic Potion Kit", "Urgent Potion Kit")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability(15)
	.setFlavorText({ name: "Possible Potions", value: rollablePotions.join(", ") });