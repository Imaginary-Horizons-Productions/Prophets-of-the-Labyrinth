const { GearTemplate } = require('../classes');

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

module.exports = new GearTemplate("Urgent Potion Kit",
	"Add 1 random potion to loot with priority",
	"Instead add @{critBonus} potions",
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, critBonus } = module.exports;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		const randomPotion = rollablePotions[adventure.generateRandomNumber(rollablePotions.length, "battle")];
		if (isCrit) {
			adventure.addResource(randomPotion, "item", "loot", critBonus);
			return `${user.getName(adventure.room.enemyIdMap)} sets a double-batch of ${randomPotion} simmering.`;
		} else {
			adventure.addResource(randomPotion, "item", "loot", 1);
			return `${user.getName(adventure.room.enemyIdMap)} sets a batch of ${randomPotion} simmering.`;
		}
	}
).setTargetingTags({ target: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Organic Potion Kit", "Reinforced Potion Kit")
	.setDurability(15)
	.setPriority(1)
	.setFlavorText({ name: "Possible Potions", value: rollablePotions.join(", ") });
