const { GearTemplate } = require('../classes');
const { addBlock } = require('../util/combatantUtil');

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


module.exports = new GearTemplate("Reinforced Potion Kit",
	"Gain @{block} block and add 1 random potion to loot",
	"Instead add @{critBonus} potions",
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, block, critBonus } = module.exports;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		const randomPotion = rollablePotions[adventure.generateRandomNumber(rollablePotions.length, "battle")];
		addBlock(user, block);
		if (isCrit) {
			adventure.addResource(randomPotion, "item", "loot", critBonus);
			return `${user.getName(adventure.room.enemyIdMap)} prepares to Block and sets a double-batch of ${randomPotion} simmering.`;
		} else {
			adventure.addResource(randomPotion, "item", "loot", 1);
			return `${user.getName(adventure.room.enemyIdMap)} prepares to Block and sets a batch of ${randomPotion} simmering.`;
		}
	}
).setTargetingTags({ target: "none", team: "none" })
	.setSidegrades("Organic Potion Kit", "Urgent Potion Kit")
	.setDurability(15)
	.setBlock(75)
	.setFlavorText({ name: "Possible Potions", value: rollablePotions.join(", ") });
